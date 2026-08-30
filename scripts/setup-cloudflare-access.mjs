#!/usr/bin/env node

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const hostname = process.env.DISCONNECT_SITE_HOSTNAME || "disconnect-plus-site.pages.dev";
const adminEmail = process.env.DISCONNECT_ADMIN_EMAIL || "disconnectaudio@sina.com";

if (!apiToken || !accountId) {
  console.error(
    "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID. " +
      "Use a scoped token with Access Apps/Policies Write and Identity Providers Write."
  );
  process.exit(1);
}

async function cloudflare(path, init = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    const errors = body.errors ? JSON.stringify(body.errors) : response.statusText;
    throw new Error(`${init.method || "GET"} ${path} failed: ${errors}`);
  }

  return body.result;
}

async function getOrganization() {
  return cloudflare(`/accounts/${accountId}/access/organizations`);
}

async function getOrCreateOtpProvider() {
  const providers = await cloudflare(`/accounts/${accountId}/access/identity_providers`);
  const existing = providers.find((provider) => provider.type === "onetimepin");
  if (existing) {
    return existing;
  }

  return cloudflare(`/accounts/${accountId}/access/identity_providers`, {
    method: "POST",
    body: JSON.stringify({
      name: "One-time PIN login",
      type: "onetimepin",
      config: {}
    })
  });
}

async function findExistingApp() {
  const apps = await cloudflare(`/accounts/${accountId}/access/apps`);
  return apps.find((app) => app.name === "DISCONNECT+ Admin");
}

async function createAccessApp(identityProviderId) {
  const existing = await findExistingApp();
  if (existing) {
    return existing;
  }

  return cloudflare(`/accounts/${accountId}/access/apps`, {
    method: "POST",
    body: JSON.stringify({
      name: "DISCONNECT+ Admin",
      type: "self_hosted",
      domain: `${hostname}/admin`,
      destinations: [
        { type: "public", uri: `${hostname}/admin*` },
        { type: "public", uri: `${hostname}/api/admin/*` }
      ],
      session_duration: "8h",
      app_launcher_visible: false,
      allowed_idps: [identityProviderId],
      auto_redirect_to_identity: true,
      http_only_cookie_attribute: true,
      enable_binding_cookie: true,
      policies: [
        {
          name: "Allow DISCONNECT+ admin email",
          decision: "allow",
          include: [{ email: { email: adminEmail } }],
          precedence: 1,
          session_duration: "8h"
        }
      ]
    })
  });
}

const organization = await getOrganization();
const otpProvider = await getOrCreateOtpProvider();
const app = await createAccessApp(otpProvider.id);

console.log("Cloudflare Access app is ready.");
console.log(`CF_ACCESS_TEAM_DOMAIN=${organization.auth_domain}`);
console.log(`CF_ACCESS_AUD=${app.aud}`);
console.log("");
console.log("Set those two values in Cloudflare Pages secrets:");
console.log("npx wrangler pages secret put CF_ACCESS_TEAM_DOMAIN --project-name disconnect-plus-site");
console.log("npx wrangler pages secret put CF_ACCESS_AUD --project-name disconnect-plus-site");
