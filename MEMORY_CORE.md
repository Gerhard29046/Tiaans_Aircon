# Tiaan's Aircon - Engineering Memory Core

## Purpose

Preserve the current Tiaan's Aircon website design, branding, wording, routes, business information, and photographs while operating entirely on Cloudflare.

## Current Milestone

**M4 - legacy runtime removed; Cloudflare production security and optional R2 setup remain. Estimated completion: 85%.**

The owner explicitly accepted a fresh Cloudflare data store with zero historical dynamic records. No legacy account or data export is required.

## Architecture

- React 18 SPA and Vite 6.
- Pages Functions expose public content APIs, contact submission, protected admin CRUD, and media endpoints.
- Production D1 `tiaans-aircon` uses database ID `04b9c5d5-5d4c-4f4e-8b9e-ebec03721cf0` in WEUR.
- D1 schema migration `0001_initial.sql` is applied. Projects, tips, reviews, enquiries, and media objects currently contain zero rows by design.
- Ten original website photographs are bundled byte-for-byte under `public/media/*.jpg` and served by Pages.
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
- Configure Access for `/admin*` and `/api/admin*`, allow only `gerhard.ark.of.war@gmail.com`, then set `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAILS`.
- Enable R2 and create the two named buckets when admin uploads and enquiry attachments are required.
- Deploy the current commit and complete independent production QA. The historical Pages deployment currently returns HTTP 522.

## Known Issues

- **CRITICAL:** current production URL returns HTTP 522 because its only recorded deployment failed.
- **BLOCKED:** Access and Turnstile dashboard resources/variables/secrets are not configured.
- **BLOCKED:** R2 activation is required for upload/attachment parity, but not for public Pages assets or text-only enquiries.
- **MEDIUM:** Workers-runtime integration coverage for real Access, D1/R2 compensation, admin CRUD, and private attachments remains incomplete.
- **MEDIUM:** generated Worker types should be refreshed after final R2 bindings and production variables are known.
- Build, lint, JavaScript typecheck, Cloudflare contract tests, generated binding checks, and local public-route smoke tests pass.

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

2026-08-26 - owner accepted a fresh empty D1; legacy SDK/plugin/auth/config/migration tooling removed; original photographs moved to Pages assets; Cloudflare-only code path established.
