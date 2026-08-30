import type { PagesContext } from "../_shared/cloudflare";
import { createOrderIntentInD1, getDatabase, loadSiteContentFromD1 } from "../_shared/data";
import { json, methodNotAllowed, missingDatabase, readJson } from "../_shared/http";
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

export async function onRequestPost(context: PagesContext) {
  const db = getDatabase(context.env);
  if (!db) {
    return missingDatabase();
  }

  let input: OrderInput;
  try {
    input = await readJson<OrderInput>(context.request);
  } catch {
    return json({ error: "Expected JSON request." }, { status: 400 });
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
