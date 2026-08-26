# Tiaan's Aircon Website

Website and content-management interface for Tiaan's Aircon, a Bellville-based business providing residential, commercial, and vehicle air-conditioning services.

## Purpose

The public site explains the business's services, displays completed work and practical air-conditioning tips, and lets prospective customers submit enquiries. The private administration area manages projects, tips, reviews, and enquiries.

## Main Features

- Air-conditioning installations, repairs, servicing, and sales information
- Vehicle air-conditioning repairs and car aircon regas information
- Project portfolio with galleries and before/after images
- Tiaan's Tips articles
- Contact details, WhatsApp/call links, enquiry form, optional photo attachment, and map
- Admin content management for projects, tips, reviews, and enquiries

## Technology

- React 18 and React Router
- Vite 6
- Tailwind CSS and Radix-based UI components
- TanStack Query
- Cloudflare Pages Functions, D1, R2, Access, and Turnstile migration foundation
- Base44 remains only for the contact flow, unmigrated live data/media, and rollback compatibility

Public content and the admin UI now target Cloudflare API facades locally. Live Cloudflare resources and Base44 data/media parity are not yet available, so remaining Base44 dependencies must not be removed yet.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Use the repository-local CLIs through `npx.cmd` on Windows.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Local Development

Install dependencies:

```bash
npm install
```

Run the Vite frontend:

```bash
npm.cmd run dev
```

Build and initialize the local Cloudflare simulation:

```powershell
npm.cmd run build
npx.cmd wrangler d1 migrations apply tiaans-aircon-local --config wrangler.local.jsonc --local
npx.cmd wrangler pages dev dist --d1 DB --r2 PUBLIC_MEDIA --r2 PRIVATE_ATTACHMENTS
```

The production `wrangler.jsonc` intentionally omits unverified live D1/R2 IDs. Never copy placeholder IDs into it.

Other repository checks:

```bash
npm run build
npm run lint
npm run typecheck
npm run preview
```

Build and lint pass. Typecheck retains the documented 105-diagnostic JavaScript baseline. See `MEMORY_CORE.md` before attempting deployment.

## Environment Variables

For frontend-only development, create or update `.env.local` in the project root. The current source references these variable names:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
VITE_BASE44_FUNCTIONS_VERSION=
```

`VITE_BASE44_APP_ID` identifies the Base44 app.

`VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests. Point it at your deployed Base44 app URL when you want the local frontend to use the hosted backend.

When you use `base44 dev`, the command injects the local Base44 values for you, so `.env.local` is mainly needed for frontend-only workflows.

The Vite configuration also recognizes the build-time `BASE44_LEGACY_SDK_IMPORTS` flag. Never commit real secrets or credentials.

## Architecture

The browser loads a React SPA. Public content pages query published records through same-origin Pages Functions. The admin UI calls protected Cloudflare APIs backed by D1 and R2. Cloudflare Access is the intended admin identity layer. The contact form and static/dynamic media still require final Base44-to-Cloudflare cutover.

The current entity definitions are under the intentionally unchanged, misspelled `base44/entitites/` path. Its discovery behaviour must be verified before renaming it.

## Deployment

The current Base44 site config declares:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The target is GitHub plus Cloudflare Pages, Pages Functions, D1, public/private R2 buckets, Access, and Turnstile. The Git remote exists, but GitHub and Cloudflare authentication are currently blocked. Do not guess account/resource IDs or deploy before the owner confirms the authenticated targets.

## Current Base44 Publish Workflow

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Project Status

Local Cloudflare foundation and frontend/admin cutover are in progress. Live Base44 export, Cloudflare resources, Access, Turnstile, media migration, deployment, and production QA remain blocked or pending.

The durable engineering state, known issues, safety constraints, and next actions are maintained in `MEMORY_CORE.md`.

## Maintenance

Projects, tips, reviews, and enquiries are currently managed through the `/admin` interface backed by Base44. Authentication/authorization needs hardening before the eventual Cloudflare migration. Preserve current design and business content unless the owner explicitly requests a change.

## References

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)
