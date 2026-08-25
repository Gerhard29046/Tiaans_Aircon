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
- Base44 SDK, entities, authentication, uploads, media hosting, and Vite plugin

Base44 remains part of the current runtime. A staged migration to Cloudflare Pages, Pages Functions, D1, and R2 is planned, but no Base44 dependency should be removed until a verified replacement exists.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. For the current Base44-backed application, install the Base44 CLI: `npm install -g base44@latest`.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Local Development

Install dependencies:

```bash
npm install
```

Run the current full Base44 development environment:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Base44 project config includes a `serveCommand`, `base44 dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Base44 project this lives in `base44/config.jsonc`.

Run only the Vite frontend against a configured hosted Base44 backend:

If you only want to work on the frontend against the hosted Base44 backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

Other repository checks:

```bash
npm run build
npm run lint
npm run typecheck
npm run preview
```

The M0 audit found that the production build and lint currently fail. See `MEMORY_CORE.md` before relying on these commands or attempting deployment.

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

The browser loads a React SPA. Public pages query published `Project`, `Tip`, and `Review` records through Base44. The contact form creates `Enquiry` records and can upload an attachment. `/admin` uses Base44 authentication and entity APIs for content CRUD and uploads. Static and uploaded media currently include Base44-hosted URLs.

The current entity definitions are under the intentionally unchanged, misspelled `base44/entitites/` path. Its discovery behaviour must be verified before renaming it.

## Deployment

The current Base44 site config declares:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The target architecture is GitHub plus Cloudflare Pages, with Pages Functions, D1, and R2 where needed. Cloudflare deployment is not configured yet, and no Git repository/remote was available during the M0 audit. Do not guess a repository URL or deploy until the build is healthy and the owner confirms the destination.

## Current Base44 Publish Workflow

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Project Status

M0 repository inspection and the M1 source-level Base44 dependency audit are complete. Live Base44 data, permissions, users, media, and deployed behaviour still require verification. Migration implementation has not started.

The durable engineering state, known issues, safety constraints, and next actions are maintained in `MEMORY_CORE.md`.

## Maintenance

Projects, tips, reviews, and enquiries are currently managed through the `/admin` interface backed by Base44. Authentication/authorization needs hardening before the eventual Cloudflare migration. Preserve current design and business content unless the owner explicitly requests a change.

## References

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)
