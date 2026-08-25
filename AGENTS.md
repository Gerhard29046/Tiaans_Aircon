# AGENTS.md

## Engineering Memory

Before substantial work, read `MEMORY_CORE.md` and the relevant existing project instructions. Treat `MEMORY_CORE.md` as the concise, durable description of current project state.

After meaningful architectural changes:

- Update `MEMORY_CORE.md` to reflect the current state rather than appending a large chronological log.
- Record newly discovered bugs under `Known Issues`, including severity where practical.
- Record important architectural decisions and unresolved decisions.
- Update the current milestone, task, recently completed work, and recommended next actions as needed.
- Never place secrets, API keys, passwords, access tokens, credentials, or private keys in the memory file.
- Keep the document concise enough to remain useful in future Codex/RuFlo sessions.

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44client.js`: frontend Base44 SDK client. Imports currently use inconsistent casing; see `MEMORY_CORE.md`.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
