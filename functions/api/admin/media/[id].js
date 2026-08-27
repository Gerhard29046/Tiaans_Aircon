import { HttpError, json, requireBinding, withErrors } from "../../../_shared/http.js";

export const onRequestDelete = withErrors(async ({ env, data, params }, requestId) => {
  const id = String(params.id);
  const referenced = await env.DB.prepare(`SELECT
    EXISTS(SELECT 1 FROM projects WHERE cover_media_id=? OR before_media_id=? OR after_media_id=?) OR
    EXISTS(SELECT 1 FROM project_images WHERE media_id=?) OR
    EXISTS(SELECT 1 FROM tips WHERE cover_media_id=?) AS in_use`).bind(id, id, id, id, id).first("in_use");
  if (referenced) throw new HttpError(409, "media_in_use", "Media cannot be deleted while it is referenced.");
  const row = await env.DB.prepare("SELECT object_key FROM media_objects WHERE id = ? AND bucket_kind = 'public_content'").bind(id).first();
  if (!row) throw new HttpError(404, "not_found", "Media not found.");
  const publicMedia = requireBinding(env, "PUBLIC_MEDIA");
  await env.DB.prepare("UPDATE media_objects SET state = 'deleting', updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
  try {
    await publicMedia.delete(row.object_key);
  } catch (error) {
    await env.DB.prepare("UPDATE media_objects SET state = 'delete_failed', updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
    throw error;
  }
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM media_objects WHERE id = ?").bind(id),
    env.DB.prepare(`INSERT INTO admin_audit_log
      (id, actor_email, action, entity_type, entity_id, request_id, summary_json, created_at)
      VALUES (?, ?, 'delete', 'media', ?, ?, '{}', ?)`)
      .bind(crypto.randomUUID(), data.admin.email, id, requestId, now),
  ]);
  return json({ deleted: true }, 200, requestId);
});
