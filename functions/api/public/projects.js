import { mapProject } from "../../_shared/db.js";
import { json, parseLimit, withErrors } from "../../_shared/http.js";

const SQL = `
  SELECT p.*,
    (SELECT group_concat(media_id, char(31)) FROM (
      SELECT media_id FROM project_images WHERE project_id = p.id ORDER BY sort_order
    )) AS image_ids
  FROM projects p
  WHERE p.published = 1
  ORDER BY COALESCE(p.project_date, p.created_at) DESC
  LIMIT ?`;

export const onRequestGet = withErrors(async ({ request, env }, requestId) => {
  const limit = parseLimit(request, 50);
  const result = await env.DB.prepare(SQL).bind(limit).all();
  return json(result.results.map(mapProject), 200, requestId, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
});
