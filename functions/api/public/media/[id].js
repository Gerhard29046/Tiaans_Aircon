import { HttpError, requireBinding, withErrors } from "../../../_shared/http.js";

export const onRequestGet = withErrors(async ({ request, env, params }) => {
  const row = await env.DB.prepare(
    "SELECT object_key, content_type FROM media_objects WHERE id = ? AND bucket_kind = 'public_content' AND state = 'ready'",
  ).bind(String(params.id || "")).first();
  if (!row) throw new HttpError(404, "not_found", "Media not found.");
  const object = await requireBinding(env, "PUBLIC_MEDIA").get(row.object_key, { onlyIf: request.headers });
  if (!object) throw new HttpError(404, "not_found", "Media not found.");
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", row.content_type);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response("body" in object ? object.body : null, { status: "body" in object ? 200 : 412, headers });
});
