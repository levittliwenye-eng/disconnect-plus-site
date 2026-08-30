import type { PagesContext } from "../_shared/cloudflare";
import { createOrderIntentInD1, getDatabase } from "../_shared/data";
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

  const input = await readJson<OrderInput>(context.request);
  const turnstile = await verifyTurnstile(
    context.request,
    context.env,
    input.turnstileToken
  );
  if (!turnstile.ok) {
    return json({ error: turnstile.error }, { status: turnstile.status });
  }

  try {
    const order = await createOrderIntentInD1(db, {
      productId: input.productId || "",
      productName: input.productName || "",
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
