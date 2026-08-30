import { json } from "./http";
import type { Env } from "./cloudflare";

type AccessPayload = {
  aud?: string | string[];
  email?: string;
  exp?: number;
  iss?: string;
  nbf?: number;
};

type AccessJwk = JsonWebKey & {
  kid?: string;
};

type AccessJwks = {
  keys?: AccessJwk[];
};

let cachedJwks: { url: string; keys: AccessJwk[]; expiresAt: number } | null = null;

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function base64UrlToJson<T>(value: string): T {
  const bytes = base64UrlToBytes(value);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text) as T;
}

function getAllowedEmails(env: Env) {
  return (env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function getJwks(teamDomain: string) {
  const url = `https://${teamDomain.replace(/^https?:\/\//, "")}/cdn-cgi/access/certs`;
  const now = Date.now();

  if (cachedJwks && cachedJwks.url === url && cachedJwks.expiresAt > now) {
    return cachedJwks.keys;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load Cloudflare Access certificates.");
  }

  const body = (await response.json()) as AccessJwks;
  const keys = body.keys || [];
  cachedJwks = {
    url,
    keys,
    expiresAt: now + 10 * 60 * 1000
  };
  return keys;
}

async function verifyAccessJwt(token: string, env: Env) {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const header = base64UrlToJson<{ alg?: string; kid?: string }>(encodedHeader);
  if (header.alg !== "RS256" || !header.kid) {
    return null;
  }

  const keys = await getJwks(env.CF_ACCESS_TEAM_DOMAIN);
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    return null;
  }

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
  const signature = base64UrlToBytes(encodedSignature);
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    signature,
    data
  );

  if (!verified) {
    return null;
  }

  const payload = base64UrlToJson<AccessPayload>(encodedPayload);
  const now = Math.floor(Date.now() / 1000);
  const issuer = `https://${env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "")}`;
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (!payload.email || !payload.exp || payload.exp <= now) {
    return null;
  }
  if (payload.nbf && payload.nbf > now) {
    return null;
  }
  if (payload.iss !== issuer && payload.iss !== `${issuer}/`) {
    return null;
  }
  if (!aud.includes(env.CF_ACCESS_AUD)) {
    return null;
  }

  return {
    email: payload.email.toLowerCase()
  };
}

export async function getAdminIdentity(request: Request, env: Env) {
  const allowedEmails = getAllowedEmails(env);
  if (allowedEmails.length === 0) {
    return null;
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    return null;
  }

  const identity = await verifyAccessJwt(token, env);
  if (!identity || !allowedEmails.includes(identity.email)) {
    return null;
  }

  return identity;
}

export async function requireAdmin(request: Request, env: Env) {
  try {
    const identity = await getAdminIdentity(request, env);
    if (identity) {
      return null;
    }
  } catch {
    return json({ error: "Cloudflare Access verification failed." }, { status: 401 });
  }

  return json(
    { error: "Admin access requires Cloudflare Access and an allowed admin email." },
    { status: 401 }
  );
}
