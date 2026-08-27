# Tiaan's Aircon - Engineering Memory Core

## Purpose

Preserve the current Tiaan's Aircon website design, branding, wording, routes, business information, and photographs while operating entirely on Cloudflare.

## Current Milestone

**M5 - Cloudflare-only production deployed; Access, R2, and the Turnstile widget are configured and verified. Only the Turnstile secret write is pending a user-approved action. Estimated completion: 98%.**

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
- A managed Turnstile widget exists for `tiaans-aircon.pages.dev` (plus `localhost`/`127.0.0.1` for local dev) with action `contact_enquiry`. The public site key is deployed and confirmed present in the production JS bundle.

## Remaining Production Configuration

- Store the Turnstile widget secret as the Pages secret `TURNSTILE_SECRET_KEY`. This write was blocked by the local safety classifier when attempted via Wrangler in this session; a user-approved run of `wrangler pages secret put TURNSTILE_SECRET_KEY --project-name tiaans-aircon` is required to finish this. Until then the contact API fails closed with `503 turnstile_not_configured`, which was confirmed live in production.

## Known Issues

- **PENDING USER ACTION:** `TURNSTILE_SECRET_KEY` is not yet stored as a Pages secret. The widget and public site key are already live. See README for the exact command.
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

2026-08-27 - R2 activation propagated; both buckets created and bound, with a verified real upload/retrieval/cleanup round trip in production. A managed Turnstile widget was created for `contact_enquiry` and the public site key is deployed and confirmed in the production bundle. `wrangler.jsonc` and `worker-configuration.d.ts` were committed and pushed (`6414db4`) and deployed to production via `wrangler pages deploy`. The owner previously confirmed the admin dashboard opens and authenticates correctly after Access configuration. Only the `TURNSTILE_SECRET_KEY` Pages secret write remains, pending a user-approved Wrangler command.
