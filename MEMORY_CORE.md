# Tiaan's Aircon - Engineering Memory Core

## Purpose

Preserve the current Tiaan's Aircon website design, branding, wording, routes, business information, and photographs while operating entirely on Cloudflare.

## Current Milestone

**M4 - Cloudflare-only production deployed; Access edge protection configured, with Turnstile and R2 activation remaining. Estimated completion: 93%.**

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
- R2 is not enabled for the account; Cloudflare API returns code 10042.

## Remaining Production Configuration

- Configure a managed Turnstile widget for `tiaans-aircon.pages.dev` with action `contact_enquiry`.
- Set `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES`, and Pages secret `TURNSTILE_SECRET_KEY`.
- Verify the approved administrator reaches the dashboard after the confirmed Access team domain and AUD are deployed.
- Enable R2 and create the two named buckets when admin uploads and enquiry attachments are required.
- Complete independent production QA after Access and Turnstile are configured.

## Known Issues

- **PENDING USER SESSION:** Production Access protects `/admin*` and `/api/admin*`; the approved administrator must confirm the dashboard opens after the confirmed team domain and AUD deployment.
- **BLOCKED:** The Pages project lists no production secrets, the deployed bundle has no `VITE_TURNSTILE_SITE_KEY`, and the contact API returns `503 turnstile_not_configured`.
- **BLOCKED:** R2 activation is required for upload/attachment parity. Wrangler list, info, and create calls all return Cloudflare API code 10042 for the confirmed account.
- **MEDIUM:** Workers-runtime integration coverage for real Access, D1/R2 compensation, admin CRUD, and private attachments remains incomplete.
- **MEDIUM:** generated Worker types should be refreshed after final R2 bindings and production variables are known.
- Build, lint, JavaScript typecheck, 14 Cloudflare contract tests, generated binding checks, public-route smoke tests, and responsive browser QA at 360/390/430/768/1024/1440 pass.

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

2026-08-27 - production Access challenge verified on `/admin*` and `/api/admin*`. Confirmed team domain `tiaans-aircon-pages.cloudflareaccess.com`, application AUD, and approved email were added to the Pages Wrangler variables; authenticated post-deployment browser confirmation remains pending.
