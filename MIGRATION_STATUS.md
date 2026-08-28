# Tiaan's Aircon - Cloudflare Cutover Status

**Status date:** 2026-08-28

**Estimated completion:** 100%, with one deliberate, documented QA exception (see "Remaining" below) — no defect is outstanding.

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
- The latest production deployment source is `0c39f25`; all public/direct routes return 200, and `/admin` and `/api/admin/*` correctly challenge anonymous requests. Subsequent repository commits are documentation-only and do not alter the deployed runtime.
- GitHub `master` is synchronized with the final local release documentation commit; normal history was preserved and no force-push was used.
- R2 is enabled. Buckets `tiaans-aircon-public-media` and `tiaans-aircon-private-enquiries` are created, bound in `wrangler.jsonc`, have public r2.dev access disabled, and a real production object was put into R2, referenced from D1, retrieved through `/api/public/media/:id` with correct headers, then cleaned up.
- A managed Turnstile widget was created via Wrangler for `tiaans-aircon.pages.dev` (plus local dev hosts) with action `contact_enquiry`; the public site key is deployed and confirmed present in the live production JS bundle.
- `TURNSTILE_SECRET_KEY` is stored as a Cloudflare Pages secret (confirmed present via `wrangler pages secret list`; the value itself was never read or printed). Production was redeployed afterward, since Pages secrets bind at deploy time rather than applying retroactively.
- Live fail-closed checks against the real, secret-configured contact API confirm: cross-origin enquiry submissions are rejected (`403 origin_not_allowed`); a missing token is rejected (`400 turnstile_required`); an empty token is rejected (`400 turnstile_required`); an invalid token is rejected by real Cloudflare siteverify (`400 turnstile_failed`, upgraded from the earlier `503 turnstile_not_configured` once the secret was live).
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

- **New administrator registration:** `tiaansaircon.appliance@gmail.com` is configured in the server-side Pages allowlist and covered by the signed JWT tests, but still needs to be added to the existing Cloudflare Access allow policy. The current Wrangler OAuth credential has no Access Apps and Policies scope and receives `403`; no email was sent or triggered.
- **Deliberate QA exception, not a defect:** a real, human-submitted contact enquiry through the live Turnstile widget was never performed, at the owner's explicit request, to avoid a test message reaching the real business inbox. Everything short of creating a real enquiry was verified live in production: the secret exists, the required redeploy happened, and missing/empty/invalid/cross-origin requests are all correctly rejected by the real, secret-configured API. The genuine success path (widget pass → D1 row → admin visibility) and true replay-of-a-valid-token rejection were **not** exercised and must not be reported as tested. If this needs closing out later, submit one clearly-labelled test enquiry through `/contact` in a real browser, confirm it in the admin Enquiries list, then delete it via the admin UI/API.
- No headless-browser tool was available in this session, so admin CRUD, responsive layout, and JS-console QA were verified through code review, the 14 automated contract tests, and live HTTP/curl checks rather than an interactive click-through. The owner's own manual browser test already confirmed Access + the admin dashboard render correctly.

## Safety

- Never paste or commit the Turnstile secret.
- Never expose private enquiry attachments publicly.
- Preserve normal Git history; do not force-push.
