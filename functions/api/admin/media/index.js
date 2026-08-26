import { formDataWithLimit, HttpError, json, withErrors } from "../../../_shared/http.js";
import { validateImage } from "../../../_shared/validation.js";

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_REQUEST_BYTES = 13 * 1024 * 1024;

export const onRequestPost = withErrors(async ({ request, env, data }, requestId) => {
  if (!request.headers.get("Content-Type")?.startsWith("multipart/form-data")) throw new HttpError(415, "unsupported_media_type", "Use multipart form data.");
  const form = await formDataWithLimit(request, MAX_REQUEST_BYTES);
  const file = form.get("file");
  const signature = await validateImage(file, MAX_FILE_BYTES);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const key = `content/${now.slice(0, 10)}/${id}.${signature.ext}`;
  await env.PUBLIC_MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: signature.type, cacheControl: "public, max-age=31536000, immutable" }, customMetadata: { mediaId: id } });
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO media_objects
        (id, bucket_kind, object_key, original_name, content_type, byte_size, created_by, created_at, updated_at)
        VALUES (?, 'public_content', ?, ?, ?, ?, ?, ?, ?)`)
        .bind(id, key, file.name.slice(0, 255), signature.type, file.size, data.admin.email, now, now),
      env.DB.prepare(`INSERT INTO admin_audit_log
        (id, actor_email, action, entity_type, entity_id, request_id, summary_json, created_at)
        VALUES (?, ?, 'upload', 'media', ?, ?, ?, ?)`)
        .bind(crypto.randomUUID(), data.admin.email, id, requestId, JSON.stringify({ fields: ["content_type", "byte_size"] }), now),
    ]);
  } catch (error) {
    await env.PUBLIC_MEDIA.delete(key);
    throw error;
  }
  return json({ id, url: `/api/public/media/${id}` }, 201, requestId);
});
