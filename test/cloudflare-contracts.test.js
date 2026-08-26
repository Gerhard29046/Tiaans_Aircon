import assert from "node:assert/strict";
import test from "node:test";
import { mapProject, mapRow } from "../functions/_shared/db.js";
import { formDataWithLimit, HttpError, parseLimit, requireBinding } from "../functions/_shared/http.js";
import { parseEnquiry, validateImage } from "../functions/_shared/validation.js";
import { verifyTurnstile } from "../functions/_shared/turnstile.js";

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
