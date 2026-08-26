import assert from "node:assert/strict";
import test from "node:test";
import { mapProject, mapRow } from "../functions/_shared/db.js";
import { formDataWithLimit, HttpError, parseLimit } from "../functions/_shared/http.js";
import { parseEnquiry, validateImage } from "../functions/_shared/validation.js";

test("parseLimit enforces the public cap", () => {
  assert.equal(parseLimit(new Request("https://example.test/api?limit=25"), 10), 25);
  assert.throws(() => parseLimit(new Request("https://example.test/api?limit=101"), 10), HttpError);
});

test("D1 rows map booleans and Base44-compatible dates", () => {
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
