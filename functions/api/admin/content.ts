import { requireAdmin } from "../../_shared/access";
import type { PagesContext } from "../../_shared/cloudflare";
import {
  getDatabase,
  loadSiteContentFromD1,
  saveSiteContentToD1
} from "../../_shared/data";
import {
  JSON_BODY_LIMITS,
  json,
  jsonRequestError,
  missingDatabase,
  readJson
} from "../../_shared/http";
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

  let input: ContentInput;
  try {
    input = await readJson<ContentInput>(context.request, JSON_BODY_LIMITS.adminContent);
  } catch (error) {
    return jsonRequestError(error);
  }
  if (!input || typeof input !== "object" || Array.isArray(input) || !input.content) {
    return json({ error: "Content payload is required." }, { status: 400 });
  }

  const content = await saveSiteContentToD1(db, input.content);
  return json({ content });
}
