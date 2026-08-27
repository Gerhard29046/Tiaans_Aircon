# Tiaan's Aircon - Cloudflare Cutover Status

**Status date:** 2026-08-27

**Estimated completion:** 93%

## Completed

- Cloudflare account, Pages project, production URL, D1, and GitHub repository verified.
- Production D1 created and schema applied.
- Fresh empty data model explicitly accepted by the owner.
- Public and admin APIs use Pages Functions and D1.
- Contact form uses the Cloudflare enquiry API and Turnstile lifecycle.
- Original ten website photographs copied unchanged into Pages static assets.
- External image transformation and fallback dependencies removed; runtime media is Cloudflare-only.
- Legacy SDK, build plugin, auth code, project config, entity definitions, and migration utilities removed.
- Missing R2 bindings now fail clearly with `503 storage_not_configured`.
- Build, lint, typecheck, Cloudflare tests (14/14), binding type check, and local/public-route smoke tests pass.
- Signed Access JWT tests cover issuer, audience, token type, approved email, and unauthorized email.
- Mocked storage tests cover public upload/D1 metadata/retrieval/deletion, private attachment isolation/admin retrieval, file validation, conditional reads, and missing-binding no-mutation behavior.
- R2/D1 failure compensation preserves the original database error and logs cleanup failures without masking it.
- Production browser QA passes at 360, 390, 430, 768, 1024, and 1440 pixels with no content overflow or JavaScript console errors; direct routes, images, map, phone, directions, and WhatsApp links pass.
- Production Access challenges anonymous `/admin*` and `/api/admin*` requests and redirects to the confirmed team domain with the confirmed application AUD.
- Confirmed `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAILS` are versioned as non-secret Pages production variables.
- Production deployment is live; all public/direct routes and APIs pass, and all ten image checksums match.

## Current counts

```text
Projects: D1 0
Tips: D1 0
Reviews: D1 0
Enquiries: D1 0
Media metadata: D1 0
Bundled public images: Pages 10
```

These zero D1 counts are the accepted starting state, not a failed migration.

## Remaining

- Enable R2 in confirmed account `72e8ade6697337b0bc2f2746b5570ff6`; API code 10042 still reports it disabled.
- Create the two buckets and enable their bindings in `wrangler.jsonc`.
- Configure the Turnstile site key and Pages secret; the production project currently lists no secrets.
- Confirm the approved administrator reaches the actual dashboard after the Access-variable deployment; anonymously and cryptographically invalid identities remain denied.
- Complete real Turnstile contact submission/replay QA and authorized production admin CRUD/upload QA after the blocked account configuration is available.

## Safety

- Never paste or commit the Turnstile secret.
- Never expose private enquiry attachments publicly.
- Preserve normal Git history; do not force-push.
