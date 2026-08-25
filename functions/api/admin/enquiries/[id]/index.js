import { HttpError, json, withErrors } from "../../../../_shared/http.js";
import { ENQUIRY_STATUSES } from "../../../../_shared/validation.js";

export const onRequestPatch = withErrors(async ({ request, env, data, params }, requestId) => {
  const body = await request.json();
  const allowed = new Set(["status", "private_notes"]);
  const unknown = Object.keys(body || {}).filter((key) => !allowed.has(key));
  if (!body || typeof body !== "object" || Array.isArray(body) || unknown.length) throw new HttpError(400, "validation_failed", "Only status and private_notes may be updated.");
  const values = {};
  if ("status" in body) {
    if (!ENQUIRY_STATUSES.has(body.status)) throw new HttpError(400, "validation_failed", "Unknown enquiry status.");
    values.status = body.status;
  }
  if ("private_notes" in body) {
    if (typeof body.private_notes !== "string" || body.private_notes.length > 10000) throw new HttpError(400, "validation_failed", "Private notes are invalid.");
    values.private_notes = body.private_notes;
  }
  const fields = Object.keys(values);
  if (!fields.length) throw new HttpError(400, "validation_failed", "At least one field is required.");
  const id = String(params.id);
  const now = new Date().toISOString();
  const update = await env.DB.prepare(`UPDATE enquiries SET ${fields.map((field) => `${field} = ?`).join(", ")}, updated_at = ? WHERE id = ?`)
    .bind(...fields.map((field) => values[field]), now, id).run();
  if (!update.meta.changes) throw new HttpError(404, "not_found", "Enquiry not found.");
  await env.DB.prepare(`INSERT INTO admin_audit_log
    (id, actor_email, action, entity_type, entity_id, request_id, summary_json, created_at)
    VALUES (?, ?, 'update', 'enquiries', ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), data.admin.email, id, requestId, JSON.stringify({ fields }), now).run();
  return json({ id, ...values, updated_date: now }, 200, requestId);
});
