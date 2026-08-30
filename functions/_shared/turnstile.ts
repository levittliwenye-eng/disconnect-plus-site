import type { Env } from "./cloudflare";

type TurnstileResponse = {
  success: boolean;
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

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);

  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) {
    form.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: form
    }
  );

  if (!response.ok) {
    return { ok: false, status: 502, error: "Turnstile verification failed." };
  }

  const result = (await response.json()) as TurnstileResponse;
  if (!result.success) {
    return { ok: false, status: 403, error: "Turnstile verification failed." };
  }

  return { ok: true };
}
