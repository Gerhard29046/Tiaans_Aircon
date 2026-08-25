import { mapTip } from "../../../_shared/db.js";
import { json, parseLimit, withErrors } from "../../../_shared/http.js";

export const onRequestGet = withErrors(async ({ request, env }, requestId) => {
  const limit = parseLimit(request, 20);
  const result = await env.DB.prepare(
    "SELECT * FROM tips WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?",
  ).bind(limit).all();
  return json(result.results.map(mapTip), 200, requestId, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
});
