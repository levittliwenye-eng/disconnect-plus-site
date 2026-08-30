import { getAdminIdentity } from "../../_shared/access";
import type { PagesContext } from "../../_shared/cloudflare";
import { json } from "../../_shared/http";

export async function onRequestGet(context: PagesContext) {
  const identity = await getAdminIdentity(context.request, context.env);
  if (!identity) {
    return json({ authenticated: false }, { status: 401 });
  }

  return json({ authenticated: true, email: identity.email });
}
