import type { PagesContext } from "../_shared/cloudflare";
import { createOrderIntentInD1, getDatabase, loadSiteContentFromD1 } from "../_shared/data";
import {
  JSON_BODY_LIMITS,
  JsonRequestError,
  json,
  jsonRequestError,
  methodNotAllowed,
  missingDatabase,
  readJson
} from "../_shared/http";
import { verifyTurnstile } from "../_shared/turnstile";

type OrderInput = {
  productId?: string;
  productName?: string;
  quantity?: number;
  customerName?: string;
  contact?: string;
  notes?: string;
  turnstileToken?: string;
};

function optionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function parseOrderInput(value: unknown): OrderInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new JsonRequestError("Invalid order request.", 400);
  }

  const input = value as Record<string, unknown>;
  return {
    productId: optionalString(input.productId),
    productName: optionalString(input.productName),
    quantity: typeof input.quantity === "number" ? input.quantity : undefined,
    customerName: optionalString(input.customerName),
    contact: optionalString(input.contact),
    notes: optionalString(input.notes),
    turnstileToken: optionalString(input.turnstileToken)
  };
}

export async function onRequestPost(context: PagesContext) {
  const db = getDatabase(context.env);
  if (!db) {
    return missingDatabase();
  }

  let input: OrderInput;
  try {
    const body = await readJson<unknown>(context.request, JSON_BODY_LIMITS.order);
    input = parseOrderInput(body);
  } catch (error) {
    return jsonRequestError(error);
  }

  const turnstile = await verifyTurnstile(
    context.request,
    context.env,
    input.turnstileToken
  );
  if (!turnstile.ok) {
    return json({ error: turnstile.error }, { status: turnstile.status });
  }

  try {
    const productId = input.productId || "";
    const content = await loadSiteContentFromD1(db);
    const product = content.products.find((item) => item.id === productId && item.active);
    if (!product) {
      return json({ error: "Selected item is not available." }, { status: 400 });
    }
    if (product.stock <= 0) {
      return json({ error: "Selected item is sold out." }, { status: 400 });
    }

    const order = await createOrderIntentInD1(db, {
      productId: product.id,
      productName: product.name.zh || product.name.en,
      quantity: input.quantity || 1,
      customerName: input.customerName || "",
      contact: input.contact || "",
      notes: input.notes || ""
    });
    return json({ order }, { status: 201 });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Order submission failed." },
      { status: 400 }
    );
  }
}

export function onRequestGet() {
  return methodNotAllowed();
}

export function onRequestPatch() {
  return methodNotAllowed();
}

export function onRequestDelete() {
  return methodNotAllowed();
}
