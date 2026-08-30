import { defaultContent, defaultOrders } from "./seed";
import { normalizeCmsContent } from "./content";
import { cleanLongText, cleanText, FIELD_LIMITS, normalizeQuantity } from "./security";
import type { CmsContent, OrderIntent } from "./types";

const CONTENT_KEY = "disconnect.cms.content";
const ORDERS_KEY = "disconnect.cms.orders";

function nowId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isLocalBrowser() {
  if (!isBrowser()) {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function readLocal<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (isBrowser()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

async function fetchJson<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: "no-store"
  });
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? String((body as { error?: unknown }).error)
        : "Request failed.";
    throw new Error(message);
  }

  return body as T;
}

function localFallbackAllowed() {
  return !isBrowser() || isLocalBrowser();
}

function useLocalStoreOnly() {
  return isLocalBrowser();
}

export function createEmptyId(prefix: string) {
  return nowId(prefix);
}

export async function checkAdminSession() {
  if (isLocalBrowser()) {
    return {
      authenticated: window.sessionStorage.getItem("disconnect.admin") === "true",
      mode: "local" as const
    };
  }

  return fetchJson<{ authenticated: boolean; email?: string }>("/api/admin/session");
}

export async function loadSiteContent(): Promise<CmsContent> {
  if (useLocalStoreOnly()) {
    return normalizeCmsContent(readLocal<CmsContent>(CONTENT_KEY, defaultContent));
  }

  try {
    const { content } = await fetchJson<{ content: CmsContent }>("/api/content");
    return normalizeCmsContent(content);
  } catch {
    return normalizeCmsContent(readLocal<CmsContent>(CONTENT_KEY, defaultContent));
  }
}

export async function saveSiteContent(content: CmsContent) {
  const normalizedContent = normalizeCmsContent(content);
  if (useLocalStoreOnly()) {
    writeLocal(CONTENT_KEY, normalizedContent);
    return normalizedContent;
  }

  try {
    const { content: saved } = await fetchJson<{ content: CmsContent }>("/api/admin/content", {
      method: "POST",
      body: JSON.stringify({ content: normalizedContent })
    });
    const normalizedSaved = normalizeCmsContent(saved);
    writeLocal(CONTENT_KEY, normalizedSaved);
    return normalizedSaved;
  } catch (error) {
    if (!localFallbackAllowed()) {
      throw error;
    }
  }

  writeLocal(CONTENT_KEY, normalizedContent);
  return normalizedContent;
}

export async function loadOrders() {
  if (useLocalStoreOnly()) {
    return readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
  }

  try {
    const { orders } = await fetchJson<{ orders: OrderIntent[] }>("/api/admin/orders");
    return orders;
  } catch (error) {
    if (!localFallbackAllowed()) {
      throw error;
    }

    return readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
  }
}

export async function submitOrderIntent(
  input: Omit<OrderIntent, "id" | "status" | "createdAt"> & {
    turnstileToken?: string;
  }
) {
  const customerName = cleanText(input.customerName, FIELD_LIMITS.name);
  const contact = cleanText(input.contact, FIELD_LIMITS.contact);
  if (!customerName || !contact) {
    throw new Error("Name and contact are required.");
  }

  const entry: OrderIntent = {
    productId: cleanText(input.productId, FIELD_LIMITS.url),
    productName: cleanText(input.productName, FIELD_LIMITS.name),
    quantity: normalizeQuantity(input.quantity),
    customerName,
    contact,
    notes: cleanLongText(input.notes, FIELD_LIMITS.notes),
    id: nowId("order"),
    status: "new",
    createdAt: new Date().toISOString()
  };

  if (useLocalStoreOnly()) {
    const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
    writeLocal(ORDERS_KEY, [entry, ...local]);
    return entry;
  }

  try {
    const { order } = await fetchJson<{ order: OrderIntent }>("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        ...entry,
        turnstileToken: input.turnstileToken
      })
    });
    return order;
  } catch (error) {
    if (!localFallbackAllowed()) {
      throw error;
    }
  }

  const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
  writeLocal(ORDERS_KEY, [entry, ...local]);
  return entry;
}

export async function updateOrderIntent(
  id: string,
  patch: Partial<OrderIntent>
) {
  if (useLocalStoreOnly()) {
    const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
    const next = local.map((order) => (order.id === id ? { ...order, ...patch } : order));
    writeLocal(ORDERS_KEY, next);
    return next.find((order) => order.id === id) ?? null;
  }

  try {
    const { order } = await fetchJson<{ order: OrderIntent }>(
      `/api/admin/orders/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(patch)
      }
    );
    return order;
  } catch (error) {
    if (!localFallbackAllowed()) {
      throw error;
    }
  }

  const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
  const next = local.map((order) => (order.id === id ? { ...order, ...patch } : order));
  writeLocal(ORDERS_KEY, next);
  return next.find((order) => order.id === id) ?? null;
}

export async function deleteOrderIntent(id: string) {
  if (useLocalStoreOnly()) {
    const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
    const next = local.filter((order) => order.id !== id);
    writeLocal(ORDERS_KEY, next);
    return next;
  }

  try {
    await fetchJson<{ ok: boolean }>(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  } catch (error) {
    if (!localFallbackAllowed()) {
      throw error;
    }
  }

  const local = readLocal<OrderIntent[]>(ORDERS_KEY, defaultOrders);
  const next = local.filter((order) => order.id !== id);
  writeLocal(ORDERS_KEY, next);
  return next;
}
