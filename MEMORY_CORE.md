# Tiaan's Aircon — Engineering Memory Core

## Project Purpose

Public website and content-management interface for Tiaan's Aircon, a Bellville air-conditioning business. Preserve the current design, wording, branding, page structure, and business contact details while replacing Base44 infrastructure with Cloudflare.

## Current Milestone

**M2 — Cloudflare foundation, side-by-side with Base44.**

The local Cloudflare data/API foundation exists and has passed initial local smoke tests. The React UI still uses Base44. Do not cut over or remove Base44 until the correct live app is inspected/exported and data/media parity is verified.

## Verified Baseline — 2026-08-25

- `jsconfig.json` and `src/components/site/SiteLayout.jsx` were recovered and are valid/nonempty.
- `npm run build`: PASS outside the filesystem sandbox. Vite reports a 629.43 kB JavaScript chunk and warns that Base44 environment values are unset; compile success is not runtime-data verification.
- `npm run lint`: PASS. Tool/runtime paths such as `.claude/**` and `.swarm/**` are globally ignored, so application lint no longer fails on `.claude/helpers/statusline.cjs`.
- Lint coverage remains incomplete: `src/lib/**`, `src/components/ui/**`, app entrypoints, hooks, API files, and Functions require a controlled later expansion.
- `npm run typecheck`: FAIL with 105 existing JavaScript diagnostics across 30 files. Main groups are inferred forwardRef/UI props, optional props inferred required, `Storage | Map` handling, and missing Vite `ImportMeta.env` types. Record and fix surgically; do not broadly convert to TypeScript.
- `npm run test:cloudflare`: PASS (4 contract tests).
- Local D1 migration applies successfully and is idempotent.
- `wrangler pages dev` compiles all Functions. Smoke checks: SPA `/` and deep route return 200; empty public API lists return 200; missing tip/media return 404; anonymous admin session returns 401.
- No Git repository exists. No push or deployment is authorized until targets are confirmed.

## Current Architecture

### Active runtime

- React 18 SPA, React Router 6, Vite 6, Tailwind CSS 3, Radix-derived UI, TanStack Query.
- Base44 still supplies bootstrap/public settings, public entity reads, admin auth/CRUD, uploads, media hosting, and Vite integration.
- Ten checked-in static URLs still point to `media.base44.com`; entity records may contain additional media URLs.

### Implemented migration foundation (not yet connected to UI)

- Cloudflare Pages config in `wrangler.jsonc`, output `dist`, Functions limited to `/api/*` by `public/_routes.json`.
- File-routed Pages Functions under `functions/api/**`.
- D1 migration `migrations/0001_initial.sql` for projects, ordered project images, tips, reviews, enquiries, media metadata, and admin audit records.
- `PUBLIC_MEDIA` R2 binding for public project/tip images.
- `PRIVATE_ATTACHMENTS` R2 binding for customer enquiry attachments. Never place private attachments in a public bucket.
- Published-only public project/tip/review APIs and direct tip slug-or-ID lookup.
- Public multipart enquiry API with exact enums, length limits, same-origin enforcement, mandatory server-side Turnstile validation, JPEG/PNG/WebP magic-byte validation, an 8 MiB attachment limit, randomized object keys, and R2 cleanup if D1 insertion fails.
- Admin API middleware verifies Cloudflare Access JWT signature, issuer, audience, expiry, and a confirmed email allowlist. Mutations also require exact same-origin requests.
- Admin content CRUD, enquiry list/status/private-notes update, protected attachment streaming, public media upload/delete checks, and minimal audit records.
- Provider-neutral frontend facades exist at `src/api/http.js`, `src/api/public.js`, and `src/api/admin.js`, but are deliberately not wired in yet.
- Wrangler 4.126.0, current Workers types, JOSE, and `package-lock.json` are installed. Generated binding types are in `worker-configuration.d.ts`.

## Live Base44 Status and Blocker

- `npx.cmd base44 whoami`: authenticated successfully on 2026-08-25.
- The project is not linked locally (`base44/.app.jsonc` is absent).
- Live project selection exposed only **ThermalCore Auto** and **Cape Events Map**. Neither can safely be assumed to be Tiaan's Aircon. Linking was cancelled before any repository or remote change.
- Required next input: grant the authenticated account access to the Tiaan's Aircon Base44 app, provide its app ID, or explicitly confirm if it has one of those unexpected names.
- Until then, live schemas, permissions, users, functions/automations, record counts, hidden/generated fields, duplicate slugs, record values, and complete media inventory remain UNKNOWN.

## Data Contracts from Source

- `Project`: `id`, title, description, category, location, project date, cover/gallery/before/after media, before-after flag, featured, published, created/updated metadata.
- `Tip`: `id`, title, slug, excerpt, content, category, cover media, read time, featured, published, published date, created/updated metadata.
- `Review`: `id`, customer name, review, rating 1–5, service, review date, published, created/updated metadata.
- `Enquiry`: `id`, name, phone, email, service, customer type, message, private attachment, status, private notes, created/updated metadata.
- Source-level schemas are in misspelled `base44/entitites/`; keep that path unchanged until live Base44 behavior is known.
- `User.jsonc` is empty. Current admin only checks Base44 authentication, not an administrator role.

## Important Decisions

- Preserve the UI and keep Base44 running during parallel implementation.
- Use domain-oriented frontend API facades, not a reimplementation of the Base44 SDK shape.
- Prefer Cloudflare Access for admin-only authentication if live inspection confirms no public/customer accounts are required.
- Independently validate Access JWTs in Functions; a header-presence check is insufficient.
- Protect both parent and wildcard Access paths: `/admin`, `/admin/*`, `/api/admin`, `/api/admin/*`.
- Use D1 prepared statements and server-side writable-field allowlists.
- Use two R2 buckets to enforce public/private media separation.
- Enquiry submission should upload and create through one server-orchestrated endpoint to avoid orphaned files.
- Do not configure attachment lifecycle deletion until the owner confirms retention requirements.
- Do not create remote Cloudflare resources, push, deploy, or guess GitHub/Cloudflare targets.

## Resolved Issues

- Empty `jsconfig.json` and empty `SiteLayout.jsx` blockers were recovered by the owner and verified.
- Lint no longer scans RuFlo/Claude runtime helpers.
- Linux-sensitive imports now match the physical lowercase filenames `base44client.js` and `logo.jsx`.
- React Query keys now include limits, preventing Home's 50/20-record queries from colliding with the 100-record Our Work/Tips queries.
- A reproducible npm lockfile now exists.
- Local Cloudflare config, D1 migration, Pages Functions, contract tests, and SPA/API smoke tests now exist.

## Known Issues / Risks

- **BLOCKED:** correct live Base44 app is unavailable to the authenticated account; export/inventory cannot safely proceed.
- **HIGH:** current `/admin` Base44 path authenticates but does not explicitly authorize administrators; Base44 server permissions remain unknown.
- **HIGH:** the current React UI still depends on Base44 and its public-settings bootstrap; local build without Base44 environment values cannot load live data/auth.
- **HIGH:** Cloudflare account, Pages project, D1 database ID, R2 resources, Access team/audience/IdP, admin identities, production hostnames, and Turnstile widget/secret are unconfirmed. `wrangler.jsonc` intentionally has no remote D1 ID.
- **HIGH:** production data/media have not been exported, transformed, imported, or parity-checked.
- **MEDIUM:** typecheck has the recorded 105-diagnostic baseline; no broad TypeScript conversion is planned.
- **MEDIUM:** ESLint application coverage remains narrower than desired.
- **MEDIUM:** no Workers-runtime integration test suite yet; current tests are Node contract tests plus `wrangler pages dev` smoke tests.
- **MEDIUM:** generic admin content endpoints currently cover scalar fields; ordered project-gallery media mutations need a finalized frontend contract after live inspection.
- **MEDIUM:** static and uploaded Base44 media still require inventory/copy/checksum verification.
- **MEDIUM:** no edge rate-limit rule can be created until the Cloudflare zone/account target is confirmed. Turnstile is implemented server-side, but the existing form is not cut over and has no widget yet.
- **LOW:** Vite bundle exceeds the default 500 kB warning threshold.
- **LOW:** `index.html` references a missing `/manifest.json` and a Base44 favicon.
- Dependency install reports 4 advisories (2 low, 2 moderate); do not run a breaking forced audit fix without triage.

## Live Export / Import Checklist

1. Confirm and link the correct Base44 app without overwriting local source.
2. Freeze writes or record an export cutoff.
3. Export raw entity schemas, permissions, users/roles, functions/automations, and all records.
4. Record exact totals plus published/draft, category, and enquiry-status counts; find nulls, unknown enums, duplicate/blank tip slugs, remote-only fields, and generated metadata.
5. Inventory every static/entity/attachment media URL with source entity/ID, content type, size, checksum, sharing, and intended public/private destination.
6. Transform deterministically, preserving Base44 IDs in `legacy_id`; validate all media before R2 upload.
7. Import media metadata, projects/gallery joins, tips, reviews, then enquiries.
8. Verify counts, constraints, relationships, checksums, R2 existence, and denial of public attachment access.
9. Perform a final delta export before cutover and retain Base44 through the rollback window.

## Next Actions

1. Obtain access/app ID or name confirmation for the correct Base44 app; complete live export and update this memory if findings alter architecture.
2. Have independent QA review the new Cloudflare Functions for auth, data consistency, API contracts, and Workers compatibility.
3. Finalize project-gallery mutation contracts and add Workers-runtime D1/R2/API tests.
4. Confirm Cloudflare Pages/D1/R2/Access/Turnstile targets and admin/hostname/retention choices.
5. Import and verify data/media locally or in an isolated preview environment.
6. Cut the frontend over route-by-route, remove the global Base44 public-settings gate, and verify visual/functional parity.
7. Only after parity: remove Base44 runtime/build dependencies and stale auth pages as approved.
8. Confirm GitHub owner/repository/default branch, secret-scan, initialize Git, and prepare CI. Push/deploy only with explicit confirmed targets.

## Verification Commands

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:cloudflare
npx.cmd wrangler types
npx.cmd wrangler d1 migrations apply tiaans-aircon --local
npx.cmd wrangler pages dev dist
```

## Secrets Rule

Never store passwords, tokens, API keys, private customer data, secret values, or real `.dev.vars` content in this file or source control.

## Last Updated

2026-08-25 — authenticated Base44 inspection attempted; live-app mismatch recorded; lint and casing stabilized; Cloudflare M2 foundation implemented and locally smoke-tested; Base44 retained pending export.
