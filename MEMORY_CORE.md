# Tiaan's Aircon - Engineering Memory Core

## Purpose

Preserve the current Tiaan's Aircon website design, branding, wording, routes, business information, and photographs while operating entirely on Cloudflare.

## Current Milestone

**M6 - Cloudflare cutover complete. Access, R2, and Turnstile (site key + secret) are configured and verified in production. Estimated completion: 100%, with one deliberate QA exception documented below (no real contact enquiry was submitted to avoid reaching the business owner).**

The owner explicitly accepted a fresh Cloudflare data store with zero historical dynamic records. No legacy account or data export is required.

## Architecture

- React 18 SPA and Vite 6.
- Pages Functions expose public content APIs, contact submission, protected admin CRUD, and media endpoints.
- Production D1 `tiaans-aircon` uses database ID `04b9c5d5-5d4c-4f4e-8b9e-ebec03721cf0` in WEUR.
- D1 schema migration `0001_initial.sql` is applied. Projects, tips, reviews, enquiries, and media objects currently contain zero rows by design.
- Ten original website photographs are bundled byte-for-byte under `public/media/*.jpg` and served by Pages. The image component has no external media fallback.
- Future admin uploads use `PUBLIC_MEDIA`; optional enquiry attachments use `PRIVATE_ATTACHMENTS`. Missing R2 bindings return explicit `503 storage_not_configured` responses.
- Contact submissions use D1 and server-side Turnstile. Submissions without files do not require R2.
- Admin authorization uses Cloudflare Access JWT verification plus the application-token type and approved-email allowlist.

## Verified Cloudflare Targets

- Account ID: `72e8ade6697337b0bc2f2746b5570ff6`.
- Pages project: `tiaans-aircon`.
- Production URL: `https://tiaans-aircon.pages.dev`.
- Git repository: `Gerhard29046/Tiaans_Aircon`, branch `master`.
- R2 is enabled for the account. Buckets `tiaans-aircon-public-media` and `tiaans-aircon-private-enquiries` exist, are bound as `PUBLIC_MEDIA` and `PRIVATE_ATTACHMENTS` in `wrangler.jsonc`, have public r2.dev access disabled, and a real production put/D1-metadata/public-retrieval/cleanup round trip has been verified.
- A managed Turnstile widget exists for `tiaans-aircon.pages.dev` (plus `localhost`/`127.0.0.1` for local dev) with action `contact_enquiry`. The public site key is deployed and confirmed present in the production JS bundle, and `TURNSTILE_SECRET_KEY` is stored as a Pages secret (confirmed present via `wrangler pages secret list`; value never read or printed). Production was redeployed after the secret was stored, since Pages secrets bind at deploy time, not retroactively to a running deployment.

## Remaining Production Configuration

- Add `tiaansaircon.appliance@gmail.com` to the existing Cloudflare Access allow policy. The application-side allowlist is configured and tested; the edge policy update requires an Access Apps and Policies credential that the current Wrangler OAuth token does not provide.
- See "Known Issues" for the documented contact-form QA exception.

## Known Issues

- **PENDING ACCESS POLICY:** The application-side administrator allowlist includes `tiaansaircon.appliance@gmail.com`, but the current Wrangler OAuth credential does not have Cloudflare Access Apps and Policies permission (`403` from the Access organization API). The same address must still be added to the existing edge Access allow policy before it can reach `/admin`; no login or verification email was sent or triggered.
- **DELIBERATE QA EXCEPTION (not a defect):** A real, human-submitted contact enquiry through the live production Turnstile widget was intentionally not performed, at the owner's explicit request, to avoid sending a test message to the real business inbox. Everything reachable without creating a real enquiry was verified live in production instead: the secret exists, a redeploy was required and completed, and the API fails closed correctly for a missing token (`400 turnstile_required`), an empty token (`400 turnstile_required`), an invalid token verified against real Cloudflare siteverify (`400 turnstile_failed`), and a cross-origin request (`403 origin_not_allowed`). The success path (genuine widget pass → D1 row → admin visibility → replay rejection) was not exercised this session and should not be described as tested.
- **MEDIUM:** No headless-browser tool is available in this environment. Admin CRUD, responsive layout, and JS-console QA are verified via code review, the 14 Cloudflare contract tests, and live HTTP/curl checks (Access challenge, origin checks, R2/D1 round trip, fail-closed Turnstile) rather than an interactive browser session. The user's own manual browser test already confirmed the admin dashboard renders and authenticates correctly.
- Build, lint, JavaScript typecheck, and 14 Cloudflare contract tests pass. Production HTTP checks confirm Access challenges `/admin*` and `/api/admin*`, cross-origin writes are rejected, and public APIs only return published content.

## Verification

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:cloudflare
npx.cmd wrangler pages dev dist --d1 DB --r2 PUBLIC_MEDIA --r2 PRIVATE_ATTACHMENTS
```

## Secrets Rule

Never place passwords, tokens, API keys, secret values, private keys, or customer data in source control or this file.

## Last Updated

2026-08-28 - `tiaansaircon.appliance@gmail.com` was added to the application-side admin allowlist and covered by the signed Access JWT contract test. The existing Wrangler OAuth token cannot modify Access Apps and Policies (`403`), so the matching edge-policy membership remains a narrowly documented user action. No login or verification email was sent or triggered.
