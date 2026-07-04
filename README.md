# TravelAI

An AI-powered travel companion that helps visitors discover **authentic**
destinations beyond typical tourism — attractions, hidden gems, immersive
heritage storytelling, local culture, cultural experiences, nearby events, local
cuisine and travel tips. Content is **database-first** and cached; AI fills gaps
and enriches, then persists results for reuse.

> **Status:** Step 1 (foundations) complete. Built feature-by-feature — see
> [`docs/PROJECT_REFERENCE.md`](docs/PROJECT_REFERENCE.md) for the full living
> spec and [`docs/ANTIGRAVITY_HANDOFF.md`](docs/ANTIGRAVITY_HANDOFF.md) to resume
> in another tool.

## Tech stack
Next.js 16 (App Router) · TypeScript (strict) · Material UI v9 · Prisma 7 +
node-postgres adapter · Neon PostgreSQL · Better Auth · Zod · bcrypt · React Hook
Form · OpenAI Responses API. Deploys to Vercel.

## Getting started
```bash
npm install                # also runs `prisma generate`
cp .env.example .env       # fill in real values (Neon URL, secrets, OpenAI key)
npm run dev                # http://localhost:3000
```

## Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Prisma Studio |
| `npm run db:deploy` | `prisma migrate deploy` (CI/prod) |

## Environment variables
See [`.env.example`](.env.example): `DATABASE_URL`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL`, `OPENAI_API_KEY`. Validated at runtime by `src/lib/env.ts`.

## Project layout
Feature-based (`src/features/*`) with shared `src/components`, `src/lib`,
`src/theme`, `src/types`. See [`src/features/README.md`](src/features/README.md).

## Deploy (Vercel)
Import the repo, set the env vars above, and deploy. Build runs `prisma generate`
(postinstall) then `next build`. Database migrations are applied with
`prisma migrate deploy` against Neon.
