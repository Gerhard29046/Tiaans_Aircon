import assert from "node:assert/strict";
import test from "node:test";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import { verifyAdminToken } from "../functions/_shared/access.js";
import { mapProject, mapRow } from "../functions/_shared/db.js";
import { formDataWithLimit, HttpError, parseLimit, requireBinding } from "../functions/_shared/http.js";
import { parseEnquiry, validateImage } from "../functions/_shared/validation.js";
import { verifyTurnstile } from "../functions/_shared/turnstile.js";
import { onRequestPost as submitEnquiry } from "../functions/api/enquiries.js";
import { onRequestGet as getPrivateAttachment } from "../functions/api/admin/enquiries/[id]/attachment.js";
import { onRequestDelete as deletePublicMedia } from "../functions/api/admin/media/[id].js";
import { onRequestPost as uploadPublicMedia } from "../functions/api/admin/media/index.js";
import { onRequestGet as getPublicMedia } from "../functions/api/public/media/[id].js";

function memoryBucket() {
  const objects = new Map();
  return {
    objects,
    async put(key, body, options = {}) {
      objects.set(key, { body, ...options });
    },
    async get(key) {
      const object = objects.get(key);
      if (!object) return null;
      return {
        body: object.body,
        writeHttpMetadata(headers) {
          if (object.httpMetadata?.contentType) headers.set("Content-Type", object.httpMetadata.contentType);
          if (object.httpMetadata?.cacheControl) headers.set("Cache-Control", object.httpMetadata.cacheControl);
        },
      };
    },
    async delete(key) {
      objects.delete(key);
    },
  };
}

function memoryD1() {
  const media = new Map();
  const enquiries = new Map();

  function execute(statement) {
    const { sql, args } = statement;
    if (/INSERT INTO media_objects/i.test(sql)) {
      const privateObject = sql.includes("'private_enquiry'");
      media.set(args[0], {
        id: args[0],
        bucket_kind: privateObject ? "private_enquiry" : "public_content",
        object_key: args[1],
        original_name: args[2],
        content_type: args[3],
        byte_size: args[4],
        state: "ready",
      });
    } else if (/INSERT INTO enquiries/i.test(sql)) {
      enquiries.set(args[0], { id: args[0], attachment_media_id: args[7] });
    } else if (/DELETE FROM media_objects/i.test(sql)) {
      media.delete(args[0]);
    }
  }

  return {
    media,
    enquiries,
    prepare(sql) {
      return {
        bind(...args) {
          const statement = {
            sql,
            args,
            async first(column) {
              if (/SELECT\s+EXISTS/i.test(sql)) return column ? 0 : { in_use: 0 };
              if (/FROM enquiries e JOIN media_objects m/i.test(sql)) {
                const enquiry = enquiries.get(args[0]);
                return enquiry ? media.get(enquiry.attachment_media_id) || null : null;
              }
              if (/FROM media_objects/i.test(sql)) {
                const row = media.get(args[0]);
                if (!row) return null;
                if (sql.includes("bucket_kind = 'public_content'") && row.bucket_kind !== "public_content") return null;
                return row;
              }
              return null;
            },
            async run() {
              if (/UPDATE media_objects SET state/i.test(sql)) {
                const row = media.get(args[1]);
                if (row) row.state = args[0] === "deleting" ? "deleting" : row.state;
              } else {
                execute(statement);
              }
              return { success: true };
            },
            async all() {
              return { results: [] };
            },
          };
          return statement;
        },
      };
    },
    async batch(statements) {
      statements.forEach(execute);
      return statements.map(() => ({ success: true }));
    },
  };
}

test("parseLimit enforces the public cap", () => {
  assert.equal(parseLimit(new Request("https://example.test/api?limit=25"), 10), 25);
  assert.throws(() => parseLimit(new Request("https://example.test/api?limit=101"), 10), HttpError);
});

test("optional file storage bindings fail with an explicit service error", () => {
  const bucket = { get() {} };
  assert.equal(requireBinding({ PUBLIC_MEDIA: bucket }, "PUBLIC_MEDIA"), bucket);
  assert.throws(
    () => requireBinding({}, "PUBLIC_MEDIA"),
    (error) => error instanceof HttpError && error.status === 503 && error.code === "storage_not_configured",
  );
});

test("D1 rows map booleans and legacy-compatible dates", () => {
  assert.deepEqual(mapRow({ id: "1", published: 1, featured: 0, created_at: "2026-01-01T00:00:00Z" }), {
    id: "1", published: true, featured: false, created_at: "2026-01-01T00:00:00Z", created_date: "2026-01-01T00:00:00Z",
  });
  assert.deepEqual(mapProject({ id: "1", published: 1, image_ids: `a\u001fb`, cover_media_id: "c" }).images, ["/api/public/media/a", "/api/public/media/b"]);
});

test("enquiry parser accepts current form values and rejects unknown enums", () => {
  const valid = new FormData();
  valid.set("name", "Customer");
  valid.set("phone", "0820000000");
  valid.set("service", "Aircon Service");
  valid.set("customer_type", "Home");
  assert.equal(parseEnquiry(valid).service, "Aircon Service");
  valid.set("customer_type", "Unknown");
  assert.throws(() => parseEnquiry(valid), HttpError);
  valid.set("customer_type", "Home");
  valid.set("email", "not-an-email");
  assert.throws(() => parseEnquiry(valid), HttpError);
});

test("multipart request parsing enforces the total request limit", async () => {
  const request = new Request("https://example.test/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data; boundary=x", "Content-Length": "10" },
    body: "0123456789",
  });
  await assert.rejects(formDataWithLimit(request, 5), (error) => error instanceof HttpError && error.status === 413);
});

test("image validation checks both MIME and magic bytes", async () => {
  const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], "photo.jpg", { type: "image/jpeg" });
  assert.equal((await validateImage(jpeg, 1024)).ext, "jpg");
  const spoofed = new File(["not an image"], "photo.jpg", { type: "image/jpeg" });
  await assert.rejects(validateImage(spoofed, 1024), HttpError);
  await assert.rejects(validateImage(jpeg, 3), (error) => error instanceof HttpError && error.code === "invalid_attachment");
});

test("Turnstile validation requires the configured action and hostname", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const request = new Request("https://tiaans-aircon.pages.dev/api/enquiries", {
    headers: { "CF-Connecting-IP": "203.0.113.10" },
  });
  const env = {
    TURNSTILE_SECRET_KEY: "test-secret",
    TURNSTILE_ALLOWED_HOSTNAMES: "tiaans-aircon.pages.dev",
  };

  globalThis.fetch = async () => Response.json({ success: true, action: "contact_enquiry", hostname: "tiaans-aircon.pages.dev" });
  await verifyTurnstile("valid-token", request, env);

  globalThis.fetch = async () => Response.json({ success: true, action: "wrong_action", hostname: "tiaans-aircon.pages.dev" });
  await assert.rejects(verifyTurnstile("valid-token", request, env), (error) => error instanceof HttpError && error.status === 400);

  globalThis.fetch = async () => Response.json({ success: true, action: "contact_enquiry", hostname: "example.com" });
  await assert.rejects(verifyTurnstile("valid-token", request, env), (error) => error instanceof HttpError && error.status === 400);
});

test("Turnstile validation fails closed when configuration or upstream verification fails", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const request = new Request("https://tiaans-aircon.pages.dev/api/enquiries");

  await assert.rejects(verifyTurnstile("token", request, {}), (error) => error instanceof HttpError && error.status === 503);
  await assert.rejects(
    verifyTurnstile("", request, { TURNSTILE_SECRET_KEY: "test-secret" }),
    (error) => error instanceof HttpError && error.status === 400,
  );

  globalThis.fetch = async () => { throw new Error("upstream unavailable"); };
  await assert.rejects(
    verifyTurnstile("token", request, { TURNSTILE_SECRET_KEY: "test-secret", TURNSTILE_ALLOWED_HOSTNAMES: "tiaans-aircon.pages.dev" }),
    (error) => error instanceof HttpError && error.status === 502,
  );
});

test("Access validates issuer, audience, token type, and approved email", async () => {
  const issuer = "https://tiaans-aircon.cloudflareaccess.com";
  const audience = "access-application-audience";
  const env = {
    ACCESS_TEAM_DOMAIN: "tiaans-aircon.cloudflareaccess.com",
    ACCESS_AUD: audience,
    ADMIN_EMAILS: "gerhard.ark.of.war@gmail.com",
  };
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const jwk = await exportJWK(publicKey);
  Object.assign(jwk, { alg: "RS256", kid: "test-key", use: "sig" });
  const jwks = createLocalJWKSet({ keys: [jwk] });
  const token = (claims = {}, overrides = {}) => new SignJWT({
    type: "app",
    email: "Gerhard.Ark.Of.War@gmail.com",
    ...claims,
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(overrides.issuer || issuer)
    .setAudience(overrides.audience || audience)
    .setIssuedAt()
    .setExpirationTime(overrides.expiration || "5m")
    .sign(overrides.privateKey || privateKey);

  assert.deepEqual(await verifyAdminToken(await token(), env, jwks), {
    email: "gerhard.ark.of.war@gmail.com",
  });
  await assert.rejects(
    verifyAdminToken(await token({}, { audience: "wrong-audience" }), env, jwks),
    (error) => error instanceof HttpError && error.status === 401 && error.code === "invalid_access_token",
  );
  await assert.rejects(
    verifyAdminToken(await token({}, { issuer: "https://wrong.cloudflareaccess.com" }), env, jwks),
    (error) => error instanceof HttpError && error.status === 401 && error.code === "invalid_access_token",
  );
  await assert.rejects(
    verifyAdminToken(await token({}, { expiration: "0s" }), env, jwks),
    (error) => error instanceof HttpError && error.status === 401 && error.code === "invalid_access_token",
  );
  const { privateKey: untrustedKey } = await generateKeyPair("RS256");
  await assert.rejects(
    verifyAdminToken(await token({}, { privateKey: untrustedKey }), env, jwks),
    (error) => error instanceof HttpError && error.status === 401 && error.code === "invalid_access_token",
  );
  await assert.rejects(
    verifyAdminToken(await token({ type: "org" }), env, jwks),
    (error) => error instanceof HttpError && error.status === 401 && error.code === "invalid_access_token",
  );
  await assert.rejects(
    verifyAdminToken(await token({ email: "unauthorized@example.com" }), env, jwks),
    (error) => error instanceof HttpError && error.status === 403 && error.code === "administrator_required",
  );
});

test("Access fails closed when required configuration is missing", async () => {
  await assert.rejects(
    verifyAdminToken("not-a-jwt", {}, async () => ({})),
    (error) => error instanceof HttpError && error.status === 503 && error.code === "auth_not_configured",
  );
});

test("public media upload persists to R2 and D1, retrieves, and deletes cleanly", async () => {
  const DB = memoryD1();
  const PUBLIC_MEDIA = memoryBucket();
  const form = new FormData();
  const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x01]);
  form.set("file", new File([bytes], "qa.jpg", { type: "image/jpeg" }));
  const uploadResponse = await uploadPublicMedia({
    request: new Request("https://tiaans-aircon.pages.dev/api/admin/media", { method: "POST", body: form }),
    env: { DB, PUBLIC_MEDIA },
    data: { admin: { email: "gerhard.ark.of.war@gmail.com" } },
  });
  assert.equal(uploadResponse.status, 201);
  const uploaded = (await uploadResponse.json()).data;
  assert.equal(DB.media.get(uploaded.id).bucket_kind, "public_content");
  assert.equal(PUBLIC_MEDIA.objects.size, 1);

  const retrieveResponse = await getPublicMedia({
    request: new Request(`https://tiaans-aircon.pages.dev${uploaded.url}`),
    env: { DB, PUBLIC_MEDIA },
    params: { id: uploaded.id },
  });
  assert.equal(retrieveResponse.status, 200);
  assert.equal(retrieveResponse.headers.get("Content-Type"), "image/jpeg");
  assert.deepEqual(new Uint8Array(await retrieveResponse.arrayBuffer()), bytes);

  const deleteResponse = await deletePublicMedia({
    env: { DB, PUBLIC_MEDIA },
    data: { admin: { email: "gerhard.ark.of.war@gmail.com" } },
    params: { id: uploaded.id },
  });
  assert.equal(deleteResponse.status, 200);
  assert.equal(DB.media.size, 0);
  assert.equal(PUBLIC_MEDIA.objects.size, 0);
});

test("public media conditional failures return 412", async () => {
  const DB = memoryD1();
  DB.media.set("conditional", {
    id: "conditional",
    bucket_kind: "public_content",
    object_key: "content/conditional.jpg",
    content_type: "image/jpeg",
    state: "ready",
  });
  const PUBLIC_MEDIA = {
    async get() {
      return {
        httpEtag: '"etag"',
        writeHttpMetadata() {},
      };
    },
  };
  const response = await getPublicMedia({
    request: new Request("https://tiaans-aircon.pages.dev/api/public/media/conditional", {
      headers: { "If-Match": '"different"' },
    }),
    env: { DB, PUBLIC_MEDIA },
    params: { id: "conditional" },
  });
  assert.equal(response.status, 412);
});

test("missing public R2 binding does not mutate media state during delete", async () => {
  const DB = memoryD1();
  DB.media.set("kept", {
    id: "kept",
    bucket_kind: "public_content",
    object_key: "content/kept.jpg",
    content_type: "image/jpeg",
    state: "ready",
  });
  const response = await deletePublicMedia({
    env: { DB },
    data: { admin: { email: "gerhard.ark.of.war@gmail.com" } },
    params: { id: "kept" },
  });
  assert.equal(response.status, 503);
  assert.equal(DB.media.get("kept").state, "ready");
});

test("enquiry attachments stay private and are available only through the admin handler", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => Response.json({
    success: true,
    action: "contact_enquiry",
    hostname: "tiaans-aircon.pages.dev",
  });

  const DB = memoryD1();
  const PRIVATE_ATTACHMENTS = memoryBucket();
  const PUBLIC_MEDIA = memoryBucket();
  const bytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const form = new FormData();
  form.set("name", "Production QA");
  form.set("phone", "0820000000");
  form.set("service", "Aircon Service");
  form.set("customer_type", "Home");
  form.set("message", "Attachment contract test");
  form.set("turnstile_token", "valid-test-token");
  form.set("attachment", new File([bytes], "unit.png", { type: "image/png" }));
  const response = await submitEnquiry({
    request: new Request("https://tiaans-aircon.pages.dev/api/enquiries", {
      method: "POST",
      headers: { Origin: "https://tiaans-aircon.pages.dev" },
      body: form,
    }),
    env: {
      DB,
      PRIVATE_ATTACHMENTS,
      TURNSTILE_SECRET_KEY: "test-secret",
      TURNSTILE_ALLOWED_HOSTNAMES: "tiaans-aircon.pages.dev",
    },
  });
  assert.equal(response.status, 201);
  const enquiryId = (await response.json()).data.id;
  assert.equal(PRIVATE_ATTACHMENTS.objects.size, 1);
  assert.equal(PUBLIC_MEDIA.objects.size, 0);

  const mediaId = DB.enquiries.get(enquiryId).attachment_media_id;
  const publicResponse = await getPublicMedia({
    request: new Request(`https://tiaans-aircon.pages.dev/api/public/media/${mediaId}`),
    env: { DB, PUBLIC_MEDIA },
    params: { id: mediaId },
  });
  assert.equal(publicResponse.status, 404);

  const attachmentResponse = await getPrivateAttachment({
    env: { DB, PRIVATE_ATTACHMENTS },
    params: { id: enquiryId },
  });
  assert.equal(attachmentResponse.status, 200);
  assert.equal(attachmentResponse.headers.get("Cache-Control"), "private, no-store");
  assert.match(attachmentResponse.headers.get("Content-Disposition"), /^attachment;/);
  assert.deepEqual(new Uint8Array(await attachmentResponse.arrayBuffer()), bytes);
});
