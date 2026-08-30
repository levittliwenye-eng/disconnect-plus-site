import { requireAdmin } from "../../_shared/access";
import type { PagesContext } from "../../_shared/cloudflare";
import {
  getDatabase,
  loadSiteContentFromD1,
  saveSiteContentToD1
} from "../../_shared/data";
import { json, missingDatabase, readJson } from "../../_shared/http";
import type { CmsContent } from "../../../lib/types";

type ContentInput = {
  content?: CmsContent;
};

export async function onRequestGet(context: PagesContext) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) {
    return denied;
  }

  const content = await loadSiteContentFromD1(getDatabase(context.env));
  return json({ content });
}

export async function onRequestPost(context: PagesContext) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) {
    return denied;
  }

  const db = getDatabase(context.env);
  if (!db) {
    return missingDatabase();
  }

  const input = await readJson<ContentInput>(context.request);
  if (!input.content) {
    return json({ error: "Content payload is required." }, { status: 400 });
  }

  const content = await saveSiteContentToD1(db, input.content);
  return json({ content });
}
