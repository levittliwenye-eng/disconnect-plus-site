import type { Env } from "./cloudflare";
import { TURNSTILE_ORDER_ACTION } from "../../lib/security";

const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const TURNSTILE_TIMEOUT_MS = 10_000;

type TurnstileResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export async function verifyTurnstile(
  request: Request,
  env: Env,
  token?: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!env.TURNSTILE_SECRET_KEY) {
    if (isLocalRequest(request)) {
      return { ok: true };
    }

    return {
      ok: false,
      status: 503,
      error: "Cloudflare Turnstile is not configured."
    };
  }

  if (!token) {
    return { ok: false, status: 400, error: "Turnstile token is required." };
  }
  if (token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return { ok: false, status: 400, error: "Turnstile token is invalid." };
  }

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);

  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) {
    form.append("remoteip", remoteIp);
  }

  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS)
      }
    );
  } catch {
    return { ok: false, status: 502, error: "Turnstile verification failed." };
  }

  if (!response.ok) {
    return { ok: false, status: 502, error: "Turnstile verification failed." };
  }

  let result: TurnstileResponse;
  try {
    result = (await response.json()) as TurnstileResponse;
  } catch {
    return { ok: false, status: 502, error: "Turnstile verification failed." };
  }

  const expectedHostname = new URL(request.url).hostname.toLowerCase();
  if (
    !result.success ||
    result.hostname?.toLowerCase() !== expectedHostname ||
    result.action !== TURNSTILE_ORDER_ACTION
  ) {
    return { ok: false, status: 403, error: "Turnstile verification failed." };
  }

  return { ok: true };
}
