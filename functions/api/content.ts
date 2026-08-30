import type { PagesContext } from "../_shared/cloudflare";
import { getDatabase, loadSiteContentFromD1 } from "../_shared/data";
import { json, methodNotAllowed } from "../_shared/http";

export async function onRequestGet(context: PagesContext) {
  const content = await loadSiteContentFromD1(getDatabase(context.env));
  return json({ content });
}

export function onRequestPost() {
  return methodNotAllowed();
}
