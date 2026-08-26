# Tiaan's Aircon - Cloudflare Cutover Status

**Status date:** 2026-08-26

**Estimated completion:** 90%

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
- Build, lint, typecheck, Cloudflare tests (8/8), binding type check, and local public-route smoke tests pass.
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

- Configure Turnstile sitekey, hostname variable, and Pages secret.
- Configure Cloudflare Access and approved administrator identity.
- Enable R2 and create the public/private buckets for upload and attachment features.
- Run full production public/admin/contact/mobile QA.

## Safety

- Never paste or commit the Turnstile secret.
- Never expose private enquiry attachments publicly.
- Preserve normal Git history; do not force-push.
