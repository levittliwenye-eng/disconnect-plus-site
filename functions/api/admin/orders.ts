import { requireAdmin } from "../../_shared/access";
import type { PagesContext } from "../../_shared/cloudflare";
import { getDatabase, loadOrdersFromD1 } from "../../_shared/data";
import { json } from "../../_shared/http";

export async function onRequestGet(context: PagesContext) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) {
    return denied;
  }

  const orders = await loadOrdersFromD1(getDatabase(context.env));
  return json({ orders });
}
