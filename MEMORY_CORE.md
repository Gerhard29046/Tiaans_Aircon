# Tiaan's Aircon - Engineering Memory Core

## Project Purpose

Public website and content-management interface for Tiaan's Aircon. Preserve the design, wording, branding, page structure, business details, and imagery while replacing Base44 infrastructure with Cloudflare.

## Current Milestone

**M3 - authenticated Cloudflare foundation and local contact cutover; live data/R2/security setup blocked. Estimated migration: 72%.**

Public content and admin code target same-origin Cloudflare APIs. Do not remove the remaining Base44 auth/media/build code until data/media parity, Turnstile, Access, and production behavior are verified.

## Verified Baseline - 2026-08-26

- Build: PASS. Lint: PASS. Cloudflare contracts: PASS, 7/7.
- Typecheck retains the known 105-diagnostic legacy baseline.
- Local Pages smoke with simulated D1/R2: `/`, `/tips/example`, `/contact`, and public project/tip/review APIs return 200; anonymous admin session returns 401.
- GitHub is authenticated as `Gerhard29046`. Commits through `4d0aef5` were pushed normally to `origin/master`; history was not rewritten.

## Current Architecture

- React 18 SPA, React Router 6, Vite 6, Tailwind 3, TanStack Query.
- Public project, tip, tip-detail, and review reads use `src/api/public.js`.
- Admin session, content managers, enquiry updates, media uploads, and project galleries use `src/api/admin.js`.
- Pages Functions use D1, separate public/private R2 bindings, Cloudflare Access JWT verification, and server-side Turnstile.
- Production `wrangler.jsonc` contains the verified D1 binding. R2 bindings remain commented until R2 is enabled. `wrangler.local.jsonc` is the local D1 config.
- `ContactForm.jsx` now submits to the Cloudflare enquiry API and has an explicit Turnstile lifecycle. It fails closed without `VITE_TURNSTILE_SITE_KEY`.

## Security and Consistency Controls

- Public reads enforce `published = 1` server-side.
- Admin middleware verifies Access JWT signature, issuer, audience, expiry, application-token type, and normalized email allowlist. Mutations require exact same-origin requests.
- Admin payload/media validation, D1 batches, enquiry/audit atomicity, bounded multipart parsing, image-signature checks, and R2 cleanup compensation are implemented.
- Turnstile validation requires success, action `contact_enquiry`, an allowed hostname, bounded token size, and a 10-second timeout; upstream errors fail closed.

## Live Base44 Status and Blocker

- CLI identity: `gerhardvanwijk@gmail.com`; Deno 2.9.5 is installed.
- App-specific privileged production access to `6a8de72bb83510043a8ec7b0` still fails during app-token exchange. Authentication alone did not grant app permission.
- Required user action: grant this identity owner/editor access or authenticate the CLI as an identity that already has access.
- No records or private data were exported. `migrations/base44-export/` remains ignored and empty.
- `migrations/export-base44.js` is repaired as a fixed-app, bounded, paginated, duplicate-checking, atomic ESM exporter that prints only counts and its private output location.
- `migrations/import-base44.js` intentionally fails closed. Build the deterministic media-aware importer only after the real export is validated.

## Live Cloudflare Status and Blockers

- Wrangler identity: `gerhard.ark.of.war@gmail.com`; sole account ID `72e8ade6697337b0bc2f2746b5570ff6`.
- Pages project/domain: `tiaans-aircon` / `tiaans-aircon.pages.dev`.
- The only recorded production deployment, source `7ea47bd`, failed. Live probes currently return HTTP 522.
- Production D1: `tiaans-aircon`, ID `04b9c5d5-5d4c-4f4e-8b9e-ebec03721cf0`, WEUR. `0001_initial.sql` is applied. Projects 0, Tips 0, Reviews 0, Enquiries 0, Media objects 0.
- R2 is not enabled (Cloudflare API code 10042). The owner must activate R2 before either required bucket can be created.
- Access and Turnstile resources/vars/secrets are not configured. The Turnstile skill forbids secret-bearing commands through project-local/npx Wrangler; use a user-approved global Wrangler or dashboard-managed secret flow.

## Remaining Base44 Runtime

- Obsolete Base44 auth pages/context, SDK client, Vite plugin, app config/entity definitions, ten static `media.base44.com` URLs, and the Base44 favicon remain.
- Contact no longer calls Base44, but it is not production-operational until Turnstile and private R2 are configured.
- Remove Base44 only after live data, media, contact, admin, and rollback parity pass.

## Known Issues / Risks

- **BLOCKED:** Base44 app authorization prevents export and exact source counts.
- **BLOCKED:** R2 activation prevents both required buckets and all media migration.
- **BLOCKED:** Access/Turnstile need dashboard configuration or an approved external credential path.
- **CRITICAL:** current Pages production deployment failed; `tiaans-aircon.pages.dev` returns 522.
- **HIGH:** production D1 is intentionally empty; no data/media parity exists.
- **HIGH:** admin cannot be exercised end to end without an Access application and valid JWT.
- **HIGH:** importer must remain disabled until the real export/media manifest is validated.
- **MEDIUM:** Workers-runtime integration coverage for Access, D1/R2 rollback, admin CRUD, and private attachments remains incomplete.
- **MEDIUM:** `worker-configuration.d.ts` is stale until final R2/non-secret bindings are known.
- **LOW:** main bundle warning, missing `/manifest.json`, and Base44 favicon remain.

## Git / RuFlo

- Remote: `https://github.com/Gerhard29046/Tiaans_Aircon.git`.
- Normal push through `4d0aef5` succeeded. Never force-push.
- RuFlo local tasks cover data migration, Cloudflare backend, security/auth, QA, and Git/deployment. In-session specialists independently reviewed data, backend, and security/QA.
- `.claude-flow` policy/task state is local coordination state, not application work; keep it out of application commits unless deliberately required.

## Next Actions

1. User enables R2 in account `72e8ade6697337b0bc2f2746b5570ff6`.
2. User grants Base44 app access (or switches CLI identity); rerun count probe, then run two safe exports and compare digests.
3. Create both R2 buckets, add bindings, download/validate/upload all media, and build the media-aware importer.
4. Configure Access for admin paths and approved email `gerhard.ark.of.war@gmail.com`.
5. Configure Turnstile widget/sitekey/Pages secret; verify a fresh success and replay rejection.
6. Import data, compare exact counts/relationships/checksums, exercise all admin/public flows, then remove Base44 runtime.
7. Push normally, deploy a complete production cutover, and independently QA the live site.

## Verification Commands

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:cloudflare
npx.cmd wrangler d1 migrations apply tiaans-aircon-local --config wrangler.local.jsonc --local
npx.cmd wrangler pages dev dist --d1 DB --r2 PUBLIC_MEDIA --r2 PRIVATE_ATTACHMENTS
```

## Secrets Rule

Never store passwords, tokens, API keys, private customer data, secret values, or real `.dev.vars` content in source control or this memory file.

## Last Updated

2026-08-26 - all CLIs authenticated; Pages/D1 verified; production D1 created and migrated empty; existing commits pushed; contact frontend cut over locally. Base44 permission, R2 activation, Access/Turnstile, parity, and successful production deployment remain.
