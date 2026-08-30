import { cleanLongText, cleanText, FIELD_LIMITS, normalizeQuantity } from "../../lib/security";
import { normalizeCmsContent } from "../../lib/content";
import { defaultContent } from "../../lib/seed";
import type { CmsContent, OrderIntent } from "../../lib/types";
import type { D1Database, Env } from "./cloudflare";

const SITE_CONTENT_ID = "production";

type OrderRow = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  customer_name: string;
  contact: string;
  notes: string | null;
  status: OrderIntent["status"];
  created_at: string;
};

function nowId(prefix: string) {
  return `${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function getDatabase(env: Env) {
  return env.DB || null;
}

function parseContent(data: string | null) {
  if (!data) {
    return defaultContent;
  }

  try {
    return normalizeCmsContent(JSON.parse(data));
  } catch {
    return defaultContent;
  }
}

export async function loadSiteContentFromD1(db: D1Database | null) {
  if (!db) {
    return defaultContent;
  }

  const row = await db
    .prepare("select data from site_content where id = ?")
    .bind(SITE_CONTENT_ID)
    .first<{ data: string }>();

  if (!row?.data) {
    await saveSiteContentToD1(db, defaultContent);
    return defaultContent;
  }

  return parseContent(row.data);
}

export async function saveSiteContentToD1(db: D1Database, content: CmsContent) {
  const normalizedContent = normalizeCmsContent(content);
  await db
    .prepare(
      "insert into site_content (id, data, updated_at) values (?, ?, ?) on conflict(id) do update set data = excluded.data, updated_at = excluded.updated_at"
    )
    .bind(SITE_CONTENT_ID, JSON.stringify(normalizedContent), new Date().toISOString())
    .run();

  return normalizedContent;
}

export async function loadOrdersFromD1(db: D1Database | null) {
  if (!db) {
    return [];
  }

  const { results = [] } = await db
    .prepare(
      "select id, product_id, product_name, quantity, customer_name, contact, notes, status, created_at from order_intents order by created_at desc limit 200"
    )
    .all<OrderRow>();

  return results.map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    customerName: row.customer_name,
    contact: row.contact,
    notes: row.notes ?? "",
    status: row.status,
    createdAt: row.created_at
  })) satisfies OrderIntent[];
}

export async function createOrderIntentInD1(
  db: D1Database,
  input: Omit<OrderIntent, "id" | "status" | "createdAt">
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

  await db
    .prepare(
      "insert into order_intents (id, product_id, product_name, quantity, customer_name, contact, notes, status, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      entry.id,
      entry.productId,
      entry.productName,
      entry.quantity,
      entry.customerName,
      entry.contact,
      entry.notes,
      entry.status,
      entry.createdAt
    )
    .run();

  return entry;
}

export async function updateOrderIntentInD1(
  db: D1Database,
  id: string,
  patch: Partial<OrderIntent>
) {
  if (
    patch.status &&
    !["new", "contacted", "paid", "fulfilled", "cancelled"].includes(patch.status)
  ) {
    throw new Error("Invalid order status.");
  }

  const row = await db
    .prepare(
      "select id, product_id, product_name, quantity, customer_name, contact, notes, status, created_at from order_intents where id = ?"
    )
    .bind(id)
    .first<OrderRow>();
  if (!row) {
    throw new Error("Order not found.");
  }

  const next: OrderIntent = {
    id: row.id,
    productId: cleanText(patch.productId ?? row.product_id, FIELD_LIMITS.url),
    productName: cleanText(patch.productName ?? row.product_name, FIELD_LIMITS.name),
    quantity: normalizeQuantity(patch.quantity ?? row.quantity),
    customerName: cleanText(patch.customerName ?? row.customer_name, FIELD_LIMITS.name),
    contact: cleanText(patch.contact ?? row.contact, FIELD_LIMITS.contact),
    notes: cleanLongText(patch.notes ?? row.notes ?? "", FIELD_LIMITS.notes),
    status: patch.status ?? row.status,
    createdAt: patch.createdAt ?? row.created_at
  };

  await db
    .prepare(
      "update order_intents set product_id = ?, product_name = ?, quantity = ?, customer_name = ?, contact = ?, notes = ?, status = ?, created_at = ? where id = ?"
    )
    .bind(
      next.productId,
      next.productName,
      next.quantity,
      next.customerName,
      next.contact,
      next.notes,
      next.status,
      next.createdAt,
      id
    )
    .run();

  return next;
}

export async function deleteOrderIntentFromD1(db: D1Database, id: string) {
  await db.prepare("delete from order_intents where id = ?").bind(id).run();
}
