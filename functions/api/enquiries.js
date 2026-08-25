import { assertSameOrigin, HttpError, json, withErrors } from "../_shared/http.js";
import { verifyTurnstile } from "../_shared/turnstile.js";
import { parseEnquiry, validateImage } from "../_shared/validation.js";

const MAX_REQUEST_BYTES = 9 * 1024 * 1024;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_FIELDS = new Set(["name", "phone", "email", "service", "customer_type", "message", "attachment", "turnstile_token"]);

export const onRequestPost = withErrors(async ({ request, env }, requestId) => {
  assertSameOrigin(request);
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_REQUEST_BYTES) throw new HttpError(413, "request_too_large", "The enquiry is too large.");
  if (!request.headers.get("Content-Type")?.startsWith("multipart/form-data")) throw new HttpError(415, "unsupported_media_type", "Use multipart form data.");

  const form = await request.formData();
  for (const key of form.keys()) {
    if (!ALLOWED_FIELDS.has(key)) throw new HttpError(400, "unknown_field", `Unknown field: ${key}`);
  }
  const values = parseEnquiry(form);
  await verifyTurnstile(String(form.get("turnstile_token") || ""), request, env);

  const now = new Date().toISOString();
  const enquiryId = crypto.randomUUID();
  const file = form.get("attachment");
  let media = null;
  if (file instanceof File && file.size > 0) {
    const signature = await validateImage(file, MAX_FILE_BYTES);
    const id = crypto.randomUUID();
    media = { id, key: `enquiries/${now.slice(0, 10)}/${id}.${signature.ext}`, type: signature.type, size: file.size, name: file.name.slice(0, 255) };
    await env.PRIVATE_ATTACHMENTS.put(media.key, await file.arrayBuffer(), { httpMetadata: { contentType: media.type }, customMetadata: { mediaId: id } });
  }

  try {
    const statements = [];
    if (media) {
      statements.push(env.DB.prepare(`INSERT INTO media_objects
        (id, bucket_kind, object_key, original_name, content_type, byte_size, created_at, updated_at)
        VALUES (?, 'private_enquiry', ?, ?, ?, ?, ?, ?)`)
        .bind(media.id, media.key, media.name, media.type, media.size, now, now));
    }
    statements.push(env.DB.prepare(`INSERT INTO enquiries
      (id, name, phone, email, service, customer_type, message, attachment_media_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`)
      .bind(enquiryId, values.name, values.phone, values.email, values.service, values.customer_type, values.message, media?.id || null, now, now));
    await env.DB.batch(statements);
  } catch (error) {
    if (media) await env.PRIVATE_ATTACHMENTS.delete(media.key);
    throw error;
  }
  return json({ id: enquiryId }, 201, requestId);
});
