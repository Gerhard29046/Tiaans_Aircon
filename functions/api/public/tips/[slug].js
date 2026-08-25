import { mapTip } from "../../../_shared/db.js";
import { HttpError, json, withErrors } from "../../../_shared/http.js";

export const onRequestGet = withErrors(async ({ env, params }, requestId) => {
  const slug = String(params.slug || "");
  const row = await env.DB.prepare(
    "SELECT * FROM tips WHERE published = 1 AND (slug = ? COLLATE NOCASE OR id = ?) LIMIT 1",
  ).bind(slug, slug).first();
  if (!row) throw new HttpError(404, "not_found", "Tip not found.");
  return json(mapTip(row), 200, requestId, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
});
