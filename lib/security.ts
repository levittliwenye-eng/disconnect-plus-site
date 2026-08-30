export const FIELD_LIMITS = {
  name: 80,
  contact: 160,
  message: 800,
  notes: 800,
  url: 500,
  quantityMax: 20
};

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function cleanText(value: string, maxLength: number) {
  return value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function cleanLongText(value: string, maxLength: number) {
  return value.replace(CONTROL_CHARS, " ").trim().slice(0, maxLength);
}

export function normalizeQuantity(value: number) {
  const quantity = Math.floor(Number(value));
  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }
  return Math.min(quantity, FIELD_LIMITS.quantityMax);
}

export function safeHref(value?: string) {
  const input = (value ?? "").trim().slice(0, FIELD_LIMITS.url);
  if (!input) {
    return "#";
  }
  if (input.startsWith("#") || input.startsWith("/")) {
    return input;
  }

  try {
    const url = new URL(input);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
      return url.toString();
    }
  } catch {
    return "#";
  }

  return "#";
}

export function safeMediaSrc(value?: string) {
  const input = (value ?? "").trim().slice(0, FIELD_LIMITS.url);
  if (!input) {
    return "";
  }
  if (input.startsWith("/")) {
    return input;
  }

  try {
    const url = new URL(input);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

export function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
}
