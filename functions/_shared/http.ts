const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
};

export const JSON_BODY_LIMITS = {
  order: 16 * 1024,
  adminMutation: 32 * 1024,
  adminContent: 512 * 1024
} as const;

export class JsonRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "JsonRequestError";
    this.status = status;
  }
}

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers
  });
}

export async function readJson<T>(
  request: Request,
  maxBytes = JSON_BODY_LIMITS.adminMutation
): Promise<T> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new JsonRequestError("Expected JSON request.", 415);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const declaredBytes = Number(contentLength);
    if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) {
      throw new JsonRequestError("JSON request is too large.", 413);
    }
  }

  if (!request.body) {
    throw new JsonRequestError("Expected JSON request.", 400);
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel("JSON request is too large.");
        throw new JsonRequestError("JSON request is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new JsonRequestError("Invalid JSON request.", 400);
  }
}

export function jsonRequestError(error: unknown) {
  if (error instanceof JsonRequestError) {
    return json({ error: error.message }, { status: error.status });
  }

  return json({ error: "Invalid JSON request." }, { status: 400 });
}

export function methodNotAllowed() {
  return json({ error: "Method not allowed." }, { status: 405 });
}

export function missingDatabase() {
  return json(
    { error: "Cloudflare D1 database binding DB is not configured." },
    { status: 503 }
  );
}
