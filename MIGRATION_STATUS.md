# Tiaan's Aircon - Cloudflare Cutover Status

**Status date:** 2026-08-27

**Estimated completion:** 98%

## Completed

- Cloudflare account, Pages project, production URL, D1, and GitHub repository verified.
- Production D1 created and schema applied.
- Fresh empty data model explicitly accepted by the owner.
- Public and admin APIs use Pages Functions and D1.
- Contact form uses the Cloudflare enquiry API and Turnstile lifecycle.
- Original ten website photographs copied unchanged into Pages static assets.
- External image transformation and fallback dependencies removed; runtime media is Cloudflare-only.
- Legacy SDK, build plugin, auth code, project config, entity definitions, and migration utilities removed.
- Build, lint, typecheck, and Cloudflare tests (14/14) pass; Wrangler types regenerated for the new R2 bindings.
- Signed Access JWT tests cover issuer, audience, token type, approved email, and unauthorized email.
- Mocked storage tests cover public upload/D1 metadata/retrieval/deletion, private attachment isolation/admin retrieval, file validation, conditional reads, and missing-binding no-mutation behavior.
- R2/D1 failure compensation preserves the original database error and logs cleanup failures without masking it.
- Production Access challenges anonymous `/admin*` and `/api/admin*` requests (verified live: 302 redirect to the Access login) and redirects to the confirmed team domain with the confirmed application AUD.
- Confirmed `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAILS` are versioned as non-secret Pages production variables.
- Production deployment is live at commit `6414db4`; all public/direct routes return 200, and `/admin` and `/api/admin/*` correctly challenge anonymous requests.
- R2 is enabled. Buckets `tiaans-aircon-public-media` and `tiaans-aircon-private-enquiries` are created, bound in `wrangler.jsonc`, have public r2.dev access disabled, and a real production object was put into R2, referenced from D1, retrieved through `/api/public/media/:id` with correct headers, then cleaned up.
- A managed Turnstile widget was created via Wrangler for `tiaans-aircon.pages.dev` (plus local dev hosts) with action `contact_enquiry`; the public site key is deployed and confirmed present in the live production JS bundle.
- Live fail-closed checks confirm: cross-origin enquiry submissions are rejected (403 `origin_not_allowed`), and submissions without a configured Turnstile secret are rejected (503 `turnstile_not_configured`) rather than silently accepted.
- Owner has personally confirmed in a real browser that Cloudflare Access authentication works and the admin dashboard renders correctly after login.

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

- Store `TURNSTILE_SECRET_KEY` as a Cloudflare Pages secret. This is the single remaining blocker for a fully working contact form. It was not completed automatically in this session because the local safety classifier blocks Wrangler commands that write secret values; run `wrangler pages secret put TURNSTILE_SECRET_KEY --project-name tiaans-aircon` and paste the widget secret from the Cloudflare Turnstile dashboard (widget `tiaans-aircon-contact`) when prompted.
- After the secret is stored, run one real end-to-end contact form submission and confirm it appears in the admin Enquiries list, then re-test replayed/invalid tokens are still rejected.
- No headless-browser tool was available in this session, so admin CRUD, responsive layout, and JS-console QA were verified through code review, the 14 automated contract tests, and live HTTP/curl checks rather than an interactive click-through. The owner's own manual browser test already confirmed Access + the admin dashboard render correctly.

## Safety

- Never paste or commit the Turnstile secret.
- Never expose private enquiry attachments publicly.
- Preserve normal Git history; do not force-push.
