#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const projectName = process.env.DISCONNECT_CF_PROJECT || "disconnect-plus-site";
const siteUrl = (process.env.DISCONNECT_SITE_URL || "https://disconnect-plus-site.pages.dev").replace(/\/$/, "");
const strict = process.argv.includes("--strict");

const requiredSecrets = [
  "ADMIN_EMAILS",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY"
];
const finalLaunchSecrets = ["CF_ACCESS_TEAM_DOMAIN", "CF_ACCESS_AUD"];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function extractSecretNames(output) {
  return Array.from(output.matchAll(/-\s+([A-Z0-9_]+):\s+Value Encrypted/g)).map((match) => match[1]);
}

function extractLatestDeployment(output) {
  const match = output.match(/│\s+([a-f0-9-]{36})\s+│\s+Production\s+│\s+main\s+│\s+([a-f0-9]{7,40})\s+│\s+(https:\/\/[^\s│]+)\s+│/);
  if (!match) {
    return null;
  }

  return {
    id: match[1],
    source: match[2],
    url: match[3]
  };
}

async function httpCheck(label, url, init, accept) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      ...init
    });
    const body = await response.text().catch(() => "");
    const ok = accept(response.status, body, response);
    return {
      label,
      ok,
      status: response.status,
      body: body.slice(0, 180).replace(/\s+/g, " ").trim()
    };
  } catch (error) {
    return {
      label,
      ok: false,
      status: "network-error",
      body: error instanceof Error ? error.message : String(error)
    };
  }
}

function hasHeader(response, name, expected) {
  const value = response.headers.get(name) || "";
  if (typeof expected === "string") {
    return value.toLowerCase().includes(expected.toLowerCase());
  }
  return expected(value);
}

function line(status, message) {
  console.log(`[${status}] ${message}`);
}

const problems = [];
const todos = [];

console.log(`DISCONNECT+ Cloudflare launch check`);
console.log(`Project: ${projectName}`);
console.log(`URL: ${siteUrl}`);
console.log("");

const secretList = run("npx", ["wrangler", "pages", "secret", "list", "--project-name", projectName]);
if (!secretList.ok) {
  problems.push("Could not read Pages secrets. Run `npx wrangler whoami` and check Cloudflare permissions.");
  line("FAIL", "Could not read Pages secrets.");
} else {
  const names = extractSecretNames(secretList.stdout);
  const missingRequired = requiredSecrets.filter((name) => !names.includes(name));
  const missingLaunch = finalLaunchSecrets.filter((name) => !names.includes(name));

  if (missingRequired.length === 0) {
    line("OK", "Required production secrets are present.");
  } else {
    problems.push(`Missing required production secrets: ${missingRequired.join(", ")}`);
    line("FAIL", `Missing required production secrets: ${missingRequired.join(", ")}`);
  }

  if (missingLaunch.length === 0) {
    line("OK", "Cloudflare Access secrets are present.");
  } else {
    todos.push(`Cloudflare Access still needs: ${missingLaunch.join(", ")}`);
    line("TODO", `Cloudflare Access still needs: ${missingLaunch.join(", ")}`);
  }
}

const deployments = run("npx", ["wrangler", "pages", "deployment", "list", "--project-name", projectName]);
if (!deployments.ok) {
  problems.push("Could not read Pages deployments.");
  line("FAIL", "Could not read Pages deployments.");
} else {
  const latest = extractLatestDeployment(deployments.stdout);
  if (latest) {
    line("OK", `Latest production deployment ${latest.source}: ${latest.url}`);
  } else {
    todos.push("Could not parse latest deployment from Wrangler output.");
    line("TODO", "Could not parse latest deployment from Wrangler output.");
  }
}

const checks = await Promise.all([
  httpCheck("home", `${siteUrl}/`, undefined, (status) => status === 200),
  httpCheck("privacy page", `${siteUrl}/privacy/`, undefined, (status, body) => {
    return status === 200 && body.includes("隐私说明") && body.includes("Cloudflare Access");
  }),
  httpCheck("robots policy", `${siteUrl}/robots.txt`, undefined, (status, body) => {
    return status === 200 && body.includes("Disallow: /admin/") && body.includes("Disallow: /api/");
  }),
  httpCheck("sitemap", `${siteUrl}/sitemap.xml`, undefined, (status, body) => {
    return status === 200 && body.includes(`${siteUrl}/</loc>`) && body.includes(`${siteUrl}/privacy/</loc>`);
  }),
  httpCheck("security.txt", `${siteUrl}/.well-known/security.txt`, undefined, (status, body) => {
    return status === 200 && body.includes("Contact: mailto:disconnectaudio@sina.com") && body.includes("Policy:");
  }),
  httpCheck("security headers", `${siteUrl}/`, undefined, (status, _body, response) => {
    return (
      status === 200 &&
      hasHeader(response, "content-security-policy", "default-src 'self'") &&
      hasHeader(response, "content-security-policy", "frame-ancestors 'none'") &&
      hasHeader(response, "referrer-policy", "strict-origin-when-cross-origin") &&
      hasHeader(response, "strict-transport-security", "max-age=31536000") &&
      hasHeader(response, "x-content-type-options", "nosniff") &&
      hasHeader(response, "x-frame-options", "DENY") &&
      hasHeader(response, "permissions-policy", "camera=()")
    );
  }),
  httpCheck("content api", `${siteUrl}/api/content`, undefined, (status, body) => {
    if (status !== 200) {
      return false;
    }
    try {
      const data = JSON.parse(body);
      return Boolean(data?.content?.settings?.contactEmail || data?.settings?.contactEmail);
    } catch {
      return false;
    }
  }),
  httpCheck("api no-store", `${siteUrl}/api/content`, undefined, (status, _body, response) => {
    return status === 200 && hasHeader(response, "cache-control", "no-store");
  }),
  httpCheck("admin protection", `${siteUrl}/admin`, undefined, (status) => [301, 302, 401, 403].includes(status)),
  httpCheck("admin api protection", `${siteUrl}/api/admin/session`, undefined, (status) => [301, 302, 401, 403].includes(status)),
  httpCheck(
    "order bot protection",
    `${siteUrl}/api/orders`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    },
    (status, body) => status === 400 && body.includes("Turnstile token is required")
  )
]);

for (const check of checks) {
  if (check.ok) {
    line("OK", `${check.label}: ${check.status}`);
  } else {
    problems.push(`${check.label} check failed: ${check.status} ${check.body}`);
    line("FAIL", `${check.label}: ${check.status} ${check.body}`);
  }
}

console.log("");
if (todos.length > 0) {
  console.log("Remaining launch todos:");
  for (const todo of todos) {
    console.log(`- ${todo}`);
  }
  console.log("- Buy or bind the final Cloudflare-managed domain, then add it to Turnstile allowed domains.");
}

if (problems.length > 0) {
  console.log("");
  console.log("Problems:");
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }
}

if (strict && (problems.length > 0 || todos.length > 0)) {
  process.exit(1);
}
