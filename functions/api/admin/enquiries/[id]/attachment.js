import { HttpError, requireBinding, withErrors } from "../../../../_shared/http.js";

export const onRequestGet = withErrors(async ({ env, params }) => {
  const row = await env.DB.prepare(`SELECT m.object_key, m.content_type, m.original_name
    FROM enquiries e JOIN media_objects m ON m.id = e.attachment_media_id
    WHERE e.id = ? AND m.bucket_kind = 'private_enquiry' AND m.state = 'ready'`)
    .bind(String(params.id)).first();
  if (!row) throw new HttpError(404, "not_found", "Attachment not found.");
  const object = await requireBinding(env, "PRIVATE_ATTACHMENTS").get(row.object_key);
  if (!object) throw new HttpError(404, "not_found", "Attachment not found.");
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", row.content_type);
  headers.set("Content-Disposition", `attachment; filename="${String(row.original_name || "attachment").replace(/["\\\r\n]/g, "_")}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
});
