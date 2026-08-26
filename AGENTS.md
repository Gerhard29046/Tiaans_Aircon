# AGENTS.md

## Engineering Memory

Before substantial work, read `MEMORY_CORE.md` and `README.md`. Keep `MEMORY_CORE.md` concise and current after architectural changes. Record known issues, decisions, milestone status, and next actions. Never store secrets, credentials, private keys, tokens, or customer data in memory or source control.

## Project Context

This is a Cloudflare Pages application. Preserve the current design, branding, wording, business details, routes, and images unless the user explicitly requests a visual/content change.

## Platform

- React/Vite frontend in `src/`.
- Cloudflare Pages Functions in `functions/`.
- D1 for projects, tips, reviews, enquiries, media metadata, and audit records.
- R2 for future public uploads and private enquiry attachments.
- Cloudflare Access for the admin surface.
- Cloudflare Turnstile for contact submissions.

## Working Notes

- Use `npm.cmd run dev` for frontend development.
- Use `npx.cmd wrangler pages dev dist --d1 DB --r2 PUBLIC_MEDIA --r2 PRIVATE_ATTACHMENTS` for the full local Pages simulation.
- Treat `wrangler.jsonc` as the production binding source of truth.
- Keep secrets in Cloudflare Pages secrets or ignored local development files; never commit them.
- Run build, lint, Cloudflare tests, and relevant smoke tests before finishing code changes.
