# Tiaan's Aircon — Cloudflare Migration Status

**Status date:** 2026-08-26

**Estimated completion:** 65%

**Phase:** local frontend/admin cutover; live infrastructure and data blocked

## Completed and verified

- Public project, tip, tip-detail, and review reads use same-origin Cloudflare APIs.
- Public routes no longer wait for Base44 auth/public-settings bootstrap.
- Admin session, Projects, Tips, Reviews, Enquiries, and uploads use `adminApi`.
- Project/tip media IDs and ordered project galleries round-trip through admin APIs.
- Pages Functions provide published-only public APIs, admin CRUD, D1/R2 storage, Access JWT verification, and Turnstile verification.
- Multipart limits, validation, audit atomicity, media-reference validation, JWKS caching, and Turnstile upstream handling were hardened.
- Build: pass. Lint: pass. Cloudflare tests: 5/5 pass. Local Pages smoke: pass. Typecheck: known 105-diagnostic baseline.

## Blocked

- Base44 CLI identity `gerhardvanwijk@gmail.com` cannot access app `6a8de72bb83510043a8ec7b0`; no export occurred.
- Wrangler authentication is expired; the intended Cloudflare account and all target resources remain unverified.
- GitHub tokens are invalid; local branch is three commits ahead of the remote. Migration work is committed locally and has not been pushed.
- Contact form remains Base44-backed until Turnstile is configured and validated.
- Ten static Base44 media URLs and dynamic entity media still need R2 migration.
- Existing export/import scripts are not safe to run and must be replaced.

## Do not do yet

- Do not import into production D1.
- Do not create Cloudflare resources until the correct account ID is verified.
- Do not remove Base44 dependencies/media/auth files until data, media, contact, and Access parity pass.
- Do not force-push or deploy.

## Exact user actions required

1. Run `npx.cmd wrangler login` in this repository, then confirm it completes.
2. Grant `gerhardvanwijk@gmail.com` owner/editor access to Base44 app `6a8de72bb83510043a8ec7b0`, or log the Base44 CLI into an identity that already has access.
3. Run `gh auth login -h github.com` and authenticate as the owner of `Gerhard29046/Tiaans_Aircon` before requesting a push.

See `MEMORY_CORE.md` for architecture, risks, verification, and the ordered continuation plan.
