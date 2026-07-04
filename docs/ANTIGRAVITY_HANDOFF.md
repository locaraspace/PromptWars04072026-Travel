# AntiGravity Handoff — TravelAI

> Paste-this-to-continue file. Read this + `PROJECT_REFERENCE.md`, then keep going
> without reading the whole codebase. Keep this file short and current.

## Where we are
**Core complete: Steps 1–3, 5, 6, 7 all done and verified live.** Foundations, DB,
auth, search + AI engine, dashboard (recent + saved), and dynamic cached events.
Endpoints: `/api/generate`, `/api/history`, `/api/saved`, `/api/profile`,
`/api/events`, `/api/auth/*`. `Ayodhya` (+ 6 cached events) and the user's own
account `nandu@gmail.com` are in the DB. `OPENAI_API_KEY` set. **Only Step 4
(landing polish) + Step 8 (final polish) remain.**

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

## Search + AI engine (Step 5) — key files
- `src/features/search/service.ts` — `searchDestination()` orchestration.
- `src/features/search/generate.ts` — OpenAI Responses API (`responses.parse`,
  `gpt-4.1`, `zodTextFormat`) with journalist-grade prompt.
- `src/features/search/content-schema.ts` — Zod shape for AI output.
- `src/features/destinations/service.ts` — `getDestinationBySlug` + full include.
- `src/features/destinations/components/DestinationView.tsx` — renders all sections.
- `src/app/api/generate/route.ts` — POST handler (auth-gated).

## Step 4 (landing + UI polish) — implemented, pending user confirmation
Landing page rebuilt with hero image + glass header/nav, feature grid,
how-it-works, destinations image strip, footer. `AppHeader` added to dashboard/
profile/destination. Cards have soft shadows + hover lift (see `theme.ts` shadow
tokens + `DestinationCard`). Images = Unsplash direct URLs via CSS backgrounds.
typecheck + lint green. **Local `npm run build` needs `.env` present** — `env.ts`
validates env at import, and the build evaluates route modules. On Vercel this is
fine (env set). Header logos use `<MuiLink href>` (never `component={Link}` from a
server component).

## Gotcha added in Step 7
- Prisma 7 **interactive** `$transaction(async tx => …)` can throw P2028
  ("Unable to start a transaction") against the pooled Neon adapter. Prefer
  sequential ops or the array form `$transaction([...])`. Events service uses
  sequential writes for this reason.

## Next task (needs approval before coding)
Final polish (deferred to last by the user): **Step 4 — Landing page** (premium
marketing hero) and **Step 8 — polish** (custom `not-found`/404, loading & empty
states sweep, `BETTER_AUTH_URL`/deploy config, README deploy checklist). The core
product is feature-complete and deployable now.
