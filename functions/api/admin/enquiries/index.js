import { mapRows } from "../../../_shared/db.js";
import { HttpError, json, parseLimit, withErrors } from "../../../_shared/http.js";
import { ENQUIRY_STATUSES } from "../../../_shared/validation.js";

export const onRequestGet = withErrors(async ({ request, env }, requestId) => {
  const url = new URL(request.url);
  const limit = parseLimit(request, 100, 200);
  const status = url.searchParams.get("status");
  if (status && !ENQUIRY_STATUSES.has(status)) throw new HttpError(400, "validation_failed", "Unknown enquiry status.");
  const result = status
    ? await env.DB.prepare("SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC LIMIT ?").bind(status, limit).all()
    : await env.DB.prepare("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ?").bind(limit).all();
  const rows = mapRows(result.results).map((row) => ({
    ...row,
    attachment: row.attachment_media_id ? `/api/admin/enquiries/${encodeURIComponent(row.id)}/attachment` : "",
  }));
  return json(rows, 200, requestId);
});
