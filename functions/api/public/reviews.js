import { mapRows } from "../../_shared/db.js";
import { json, parseLimit, withErrors } from "../../_shared/http.js";

export const onRequestGet = withErrors(async ({ request, env }, requestId) => {
  const limit = parseLimit(request, 12);
  const result = await env.DB.prepare(
    "SELECT * FROM reviews WHERE published = 1 ORDER BY COALESCE(review_date, created_at) DESC LIMIT ?",
  ).bind(limit).all();
  return json(mapRows(result.results), 200, requestId, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
});
