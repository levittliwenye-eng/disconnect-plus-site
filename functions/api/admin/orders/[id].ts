import { requireAdmin } from "../../../_shared/access";
import type { PagesContext } from "../../../_shared/cloudflare";
import {
  deleteOrderIntentFromD1,
  getDatabase,
  updateOrderIntentInD1
} from "../../../_shared/data";
import {
  JSON_BODY_LIMITS,
  JsonRequestError,
  json,
  jsonRequestError,
  missingDatabase,
  readJson
} from "../../../_shared/http";
import type { OrderIntent } from "../../../../lib/types";

type RouteParams = {
  id: string;
};

export async function onRequestPatch(context: PagesContext<RouteParams>) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) {
    return denied;
  }

  const db = getDatabase(context.env);
  if (!db) {
    return missingDatabase();
  }

  try {
    const patch = await readJson<Partial<OrderIntent>>(
      context.request,
      JSON_BODY_LIMITS.adminMutation
    );
    const order = await updateOrderIntentInD1(db, context.params.id, patch);
    return json({ order });
  } catch (error) {
    if (error instanceof JsonRequestError) {
      return jsonRequestError(error);
    }
    return json(
      { error: error instanceof Error ? error.message : "Order update failed." },
      { status: 400 }
    );
  }
}

export async function onRequestDelete(context: PagesContext<RouteParams>) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) {
    return denied;
  }

  const db = getDatabase(context.env);
  if (!db) {
    return missingDatabase();
  }

  await deleteOrderIntentFromD1(db, context.params.id);
  return json({ ok: true });
}
