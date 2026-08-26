# Tiaan's Aircon Website

Public website and Cloudflare-hosted content-management interface for Tiaan's Aircon, serving residential, commercial, and vehicle air-conditioning customers in Bellville and Cape Town.

## Stack

- React 18, React Router, Vite 6, and Tailwind CSS
- Cloudflare Pages and Pages Functions
- Cloudflare D1 for content, enquiries, media metadata, and audit records
- Cloudflare R2 for future admin uploads and private enquiry attachments
- Cloudflare Access for administrator authentication
- Cloudflare Turnstile for enquiry spam protection

## Local development

```powershell
npm install
npm.cmd run dev
```

For the full Pages runtime:

```powershell
npm.cmd run build
npx.cmd wrangler d1 migrations apply tiaans-aircon-local --config wrangler.local.jsonc --local
npx.cmd wrangler pages dev dist --d1 DB --r2 PUBLIC_MEDIA --r2 PRIVATE_ATTACHMENTS
```

## Configuration

The public Turnstile site key is a Vite build variable:

```text
VITE_TURNSTILE_SITE_KEY=
```

Pages Functions require these non-secret variables in production:

```text
TURNSTILE_ALLOWED_HOSTNAMES=tiaans-aircon.pages.dev
ACCESS_TEAM_DOMAIN=
ACCESS_AUD=
ADMIN_EMAILS=gerhard.ark.of.war@gmail.com
```

Store `TURNSTILE_SECRET_KEY` as a Cloudflare Pages secret. Never commit it.

## Data model

The Cloudflare database intentionally starts with zero projects, tips, reviews, and enquiries. New content is created through `/admin` after Cloudflare Access is configured. The ten existing design photographs are bundled unchanged under `public/media/` and served directly by Pages.

## Checks

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:cloudflare
```

Build, lint, typecheck, and Cloudflare contract tests must pass before deployment.

## Deployment

Production target:

```text
Cloudflare Pages project: tiaans-aircon
Production URL: https://tiaans-aircon.pages.dev
D1 database: tiaans-aircon
```

Do not deploy an admin/contact cutover until Access and Turnstile are configured. R2 is optional for the initial public deployment but required for image uploads and enquiry attachments.
