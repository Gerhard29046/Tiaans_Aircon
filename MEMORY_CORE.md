# Tiaan's Aircon — Engineering Memory Core

## Project Purpose

Public website and content-management interface for Tiaan's Aircon. Preserve the current design, wording, branding, page structure, and business details while replacing Base44 infrastructure with Cloudflare.

## Current Milestone

**M3 — local Cloudflare frontend/admin cutover; live data and infrastructure blocked. Estimated migration: 65%.**

The public content pages and admin UI now target same-origin Cloudflare API facades. Base44 is no longer a global rendering/authentication dependency. Do not remove the remaining Base44 contact/auth/media/build code until live data/media parity, Turnstile, Cloudflare Access, and production bindings are verified.

## Verified Baseline — 2026-08-26

- `npm.cmd run build`: PASS; 627.02 kB main JS chunk warning remains.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: FAIL with the existing 105 JavaScript diagnostics; no broad TypeScript conversion is planned.
- `npm.cmd run test:cloudflare`: PASS, 5/5 contract tests.
- Local Pages smoke test with simulated `DB`, `PUBLIC_MEDIA`, and `PRIVATE_ATTACHMENTS`: `/`, `/tips/example`, and public project/tip/review APIs return 200; anonymous admin session returns 401.
- Git branch `master` is three commits ahead of `origin/master`; migration work is committed locally. GitHub tokens for both configured identities are invalid, so push is blocked. Only RuFlo policy audit state remains modified outside the application commit.

## Current Architecture

- React 18 SPA, React Router 6, Vite 6, Tailwind 3, TanStack Query.
- Public `Home`, `OurWork`, `Tips`, `TipDetail`, and review reads use `src/api/public.js`; tip detail uses its dedicated endpoint.
- `App.jsx` no longer wraps public routes in Base44 `AuthProvider`; the 404 page no longer calls Base44 auth.
- Admin session, all four content managers, enquiry updates, and image uploads use `src/api/admin.js`.
- Admin project/tip media editors preserve media IDs. Projects support ordered gallery replacement through `image_ids` while public responses retain URL fields for visual compatibility.
- Pages Functions use D1, separate public/private R2 bindings, Cloudflare Access JWT verification, and server-side Turnstile.
- `wrangler.jsonc` intentionally has no live D1/R2 IDs. `wrangler.local.jsonc` exists only for local D1 migration commands; Pages local development uses CLI-only simulated bindings.

## Security and Consistency Controls

- Public reads enforce `published = 1` server-side.
- Admin middleware verifies Access JWT signature, issuer, audience, expiry, and a confirmed email allowlist; mutations require exact same-origin requests.
- Access JWKS clients are cached by issuer.
- Admin content payloads enforce field allowlists, types, enums, lengths, boolean types, rating bounds, and ready public-media references.
- Project gallery writes and audit entries are included in D1 batches; enquiry updates and audits are atomic.
- Public/admin multipart bodies are byte-limited even without a valid `Content-Length`.
- Enquiries reject duplicate/unknown fields, File values in text fields, invalid email syntax, invalid enums, and invalid image signatures.
- Turnstile validation checks success, exact `contact_enquiry` action, allowed hostname, has a 10-second timeout, and fails closed on upstream errors.

## Live Base44 Status and Blocker

- Base44 CLI is authenticated as `gerhardvanwijk@gmail.com`.
- Deno 2.9.5 is installed, so `base44 exec` is operational.
- A read-only privileged production probe against confirmed app ID `6a8de72bb83510043a8ec7b0` was rejected: the authenticated identity does not have permission to access the app.
- Required user action: grant that Base44 identity owner/editor access to the app, or authenticate the CLI as an identity that already has access.
- No records or private data were exported. `migrations/base44-export/` remains ignored and empty.
- Existing `migrations/export-base44.js` is only a manual template. Existing `migrations/import-base44.js` is unsafe/nonfunctional: CommonJS in an ESM package, wrong source fields/enums/dates, wrong D1 columns, incomplete table coverage, and no transactional/idempotent import. Do not run either as a production migration.

## Live Cloudflare Status and Blocker

- Wrangler 4.126.0 is installed, but `wrangler whoami` reports an expired token and cannot refresh non-interactively.
- No Pages project, D1 database, R2 bucket, Access application, Turnstile widget, account ID, audience, or production binding was verified in this session.
- Required user action: run `npx.cmd wrangler login`, then confirm the selected account is the intended account before any resource creation.
- Never guess database IDs or deploy while account identity is ambiguous.

## Remaining Base44 Runtime

- `ContactForm.jsx` still uploads/creates enquiries through Base44 because no Turnstile widget/sitekey/secret has been configured.
- Base44 auth context and obsolete login/register/reset/OAuth files remain in source but are no longer in the active route tree.
- Base44 SDK/client, Vite plugin, app config/entity definitions, ten static `media.base44.com` URLs, and Base44 favicon remain.
- Remove these only after contact, Access, data, and media parity are live and verified.

## Known Issues / Risks

- **BLOCKED:** Base44 app access prevents export and parity verification.
- **BLOCKED:** Cloudflare authentication is expired; live targets/resources cannot be verified or created.
- **HIGH:** production data/media have not been exported, imported, or parity-checked.
- **HIGH:** contact remains Base44-backed; Cloudflare enquiry endpoint cannot be cut over until Turnstile is configured and end-to-end tested.
- **HIGH:** admin Cloudflare code is locally compiled but cannot be exercised end-to-end without Access JWT and live/simulated admin fixtures.
- **HIGH:** export/import utilities must be replaced before any D1 import.
- **MEDIUM:** public-media deletion still needs a recoverable tombstone/reconciliation workflow.
- **MEDIUM:** Workers-runtime integration tests for Access, Turnstile, D1 rollback, R2 cleanup, admin CRUD, and private attachments are missing.
- **MEDIUM:** typecheck has 105 legacy diagnostics; lint coverage remains incomplete.
- **LOW:** main bundle exceeds Vite's 500 kB warning threshold.
- **LOW:** `index.html` still references a missing `/manifest.json` and Base44 favicon.

## Git / Deployment

- Remote: `https://github.com/Gerhard29046/Tiaans_Aircon.git`.
- Local history is preserved; never force-push.
- `gh auth status` reports invalid tokens for `GerhardVanWijk` and `Gerhard29046`. Re-authenticate as the repository owner before a normal push.
- No Cloudflare deployment or production D1 migration/import was performed.
- RuFlo was initialized as a seven-role hierarchical swarm. Three provider-backed agents were created but remained idle and were stopped after security policy prevented sending private repository data externally. In-session private specialist reviews covered frontend/admin, Cloudflare/security, and Base44/data/Git/QA.

## Next Actions

1. User runs `npx.cmd wrangler login`; verify account ID, Pages target, existing D1/R2 resources, and R2 enablement before creation.
2. User grants Base44 app access (or switches Base44 CLI identity); rerun read-only count probe, then replace and run safe paginated export tooling.
3. Create/verify D1 and both R2 buckets in the correct account, add real production bindings, regenerate Worker types, and apply schema deliberately.
4. Configure Cloudflare Access for `/admin`, `/admin/*`, `/api/admin`, and `/api/admin/*` with the authorized email.
5. Complete the Turnstile setup wizard, wire `ContactForm` to `publicApi.submitEnquiry`, and test success plus token replay rejection.
6. Replace unsafe import tooling; migrate media/data into an isolated target and verify counts, relationships, checksums, and private attachment denial.
7. Add Workers-runtime integration tests and exercise admin CRUD/uploads.
8. Remove remaining Base44 runtime only after parity; update final README, authenticate GitHub, commit, push normally, then deploy and run production QA.

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

2026-08-26 — local public/admin cutover and security hardening completed; Base44 access denial and expired Cloudflare authentication verified; build/lint/tests and local Pages smoke checks passed.
