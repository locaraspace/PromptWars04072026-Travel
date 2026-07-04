# AntiGravity Handoff — TravelAI

> Paste-this-to-continue file. Read this + `PROJECT_REFERENCE.md`, then keep going
> without reading the whole codebase. Keep this file short and current.

## Where we are
**Steps 1–3 complete.** Foundations scaffolded; 11-model schema + Better Auth
tables applied to Neon (migrations `init`, `add_auth_models`). **Authentication
works end-to-end** (Better Auth + bcrypt, verified against Neon): register/login/
logout, sessions, protected `/dashboard` + `/profile`, `proxy.ts` edge guard.
Next up: Step 4 (Landing) or Step 5 (Search + AI — the product core).

> Notes: (1) dev's local network blocks port 5432 — run `prisma migrate` from an
> unblocked env. (2) After any schema change run `npm run db:generate` before
> starting, or Better Auth errors "Model account does not exist".

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
- **Auth**: server instance `src/lib/auth.ts` (Better Auth + Prisma + bcrypt);
  browser `src/lib/auth-client.ts`; server session `src/lib/session.ts`
  (`getServerSession`, `requireSession`); edge guard `src/proxy.ts`. Endpoints
  under `/api/auth/*` (sign-up/email, sign-in/email, sign-out, get-session).
- **Links**: never pass `component={Link}` from a Server Component to MUI — the
  theme sets `LinkBehavior` as the default, so just use `href`.

## Gotchas
- Prisma 7 needs a **driver adapter** — already wired (`PrismaPg`). Don't call
  `new PrismaClient()` without the adapter.
- After any schema change, run `npm run db:generate` (migrate dev may not refresh
  the client) or Better Auth errors "Model account does not exist".
- MUI v9: put `alignItems`/`fontWeight`/`textAlign` in `sx`, not as props.
- Next 16: middleware is now **`proxy.ts`** (named `proxy` export). Bundled docs
  at `node_modules/next/dist/docs/`.

## Next task (needs approval before coding)
**Step 5 — Search flow + AI engine** (recommended, product core): destination
search → DB-first lookup by slug → return cached data → on miss, generate
journalist-quality content via OpenAI Responses API → persist → return. Also
`/api/generate`, search history writes. (Or Step 4 — Landing page — first.)
