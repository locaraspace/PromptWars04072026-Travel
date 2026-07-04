# AntiGravity Handoff — TravelAI

> Paste-this-to-continue file. Read this + `PROJECT_REFERENCE.md`, then keep going
> without reading the whole codebase. Keep this file short and current.

## Where we are
**Step 1 complete: project foundations.** The app builds, typechecks and lints
clean. No product features yet.

## Workflow contract (important)
The user drives feature-by-feature. For every step:
1. **Explain the plan.** 2. **Wait for approval.** 3. Implement **only** that step.
4. Update `PROJECT_REFERENCE.md` **and** this file. 5. Suggest the next step.
Never skip planning, never skip docs, never batch unrelated features.

## Tech stack (as built)
Next.js **16** (App Router) · TypeScript strict · MUI **v9** (light theme) ·
Prisma **7** + `@prisma/adapter-pg` (Neon Postgres) · Better Auth (pending) ·
Zod 4 · bcrypt · React Hook Form · OpenAI Responses API (pending). Package
manager: **npm**. Content focus: **India-first**. Events search: **OpenAI
built-in web_search**.

## How to run
```bash
npm install            # runs prisma generate via postinstall
cp .env.example .env   # then fill real values
npm run dev            # http://localhost:3000
npm run typecheck && npm run lint && npm run build   # all must stay green
```
Prisma helpers: `npm run db:migrate`, `db:generate`, `db:studio`, `db:deploy`.

## Key files / conventions
- Design tokens + theme: `src/theme/theme.ts` (primary `#2E7D32`, secondary
  `#FF9800`, bg `#FAFAFA`, radius 12, Poppins). Applied via
  `src/theme/ThemeRegistry.tsx`.
- Env (server only): `src/lib/env.ts` (Zod-validated). DB client: `src/lib/prisma.ts`.
- Features live in `src/features/<name>` (see `src/features/README.md`).
- Prisma client is generated to `src/generated/prisma` (gitignored).
- Strict TS, **no `any`**; validate external input with Zod.

## Gotchas
- Prisma 7 needs a **driver adapter** — already wired (`PrismaPg`). Don't call
  `new PrismaClient()` without the adapter.
- MUI v9: put `alignItems`/`fontWeight`/`textAlign` in `sx`, not as props.
- `.env` has **placeholders**; set a real Neon `DATABASE_URL` before Step 2.
- Next 16 has bundled docs at `node_modules/next/dist/docs/` — check them for API
  changes.

## Next task (needs approval before coding)
**Step 2 — Database schema:** define all 11 tables + relations in
`prisma/schema.prisma`, then create the first migration (`npm run db:migrate`).
Blocker: a real Neon `DATABASE_URL`.
