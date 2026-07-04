# TravelAI — Project Reference

> Single source of truth for the project state. Updated after **every** completed
> step. Another developer or AI (e.g. AntiGravity) should be able to continue
> from this file without reading the whole codebase.

---

## Project Overview

### Purpose
An AI-powered travel companion that helps visitors discover **authentic**
destinations beyond typical tourism: attractions, hidden gems, immersive
heritage storytelling, local culture, cultural experiences (the USP), nearby
festivals/events, local cuisine and travel tips. Content is **database-first**
and cached; AI is used only to fill gaps or enrich, then persisted.

### Current Status
🟢 **Step 1 complete — Project foundations scaffolded.** App builds, typechecks
and lints clean. No features implemented yet.

### Completed Features
- [x] **Step 1 — Scaffold & foundations**: Next.js 16 + TypeScript (strict) app,
  MUI v9 Material Design theme (light, Poppins, brand palette), Prisma 7 client
  with node-postgres driver adapter, validated env module, feature-based folder
  structure, ESLint (no `any`), `.env.example`, docs.

### Pending Features
- [ ] **Step 2 — Database schema**: all 11 tables + relations, first migration.
- [ ] **Step 3 — Authentication** (Better Auth): register/login/logout, protected
  routes, profile.
- [ ] **Step 4 — Landing page**.
- [ ] **Step 5 — Search flow + AI engine** (DB-first → cache → AI fallback → persist).
- [ ] **Step 6 — User dashboard** (search, recent, saved, profile).
- [ ] **Step 7 — Events** (dynamic OpenAI web-search refresh + cache).
- [ ] **Step 8 — Polish**: loading/empty/404 states, validation, deploy config.

---

## Project Architecture

Feature-based architecture. Each capability lives in `src/features/<name>` and
owns its components/hooks/services/schemas. Cross-cutting building blocks live in
`src/components`, `src/lib`, `src/theme`, `src/types`. No duplicated code;
reusable components and utilities only. Strict TypeScript, no `any`.

### Folder Structure
```
.
├── docs/
│   ├── PROJECT_REFERENCE.md      # this file (living spec)
│   └── ANTIGRAVITY_HANDOFF.md    # lean "resume here" file for AntiGravity
├── prisma/
│   └── schema.prisma             # datasource + generator only (models: Step 2)
├── prisma.config.ts              # Prisma 7 config (schema path, migrations, DB url)
├── public/
├── src/
│   ├── app/                      # App Router
│   │   ├── layout.tsx            # root layout: Poppins + ThemeRegistry
│   │   ├── page.tsx              # themed placeholder landing (temporary)
│   │   └── globals.css           # minimal reset
│   ├── components/               # shared reusable UI (empty)
│   ├── features/                 # auth, destinations, search, dashboard, profile, history
│   │   └── README.md             # feature conventions
│   ├── generated/prisma/         # Prisma client output (gitignored, regenerated)
│   ├── lib/
│   │   ├── env.ts                # Zod-validated server env
│   │   └── prisma.ts             # Prisma client singleton (pg driver adapter)
│   ├── theme/
│   │   ├── theme.ts              # design tokens + MUI theme
│   │   └── ThemeRegistry.tsx     # App Router Emotion cache + ThemeProvider
│   └── types/                    # shared types (empty)
├── .env.example                  # env template (committed)
├── eslint.config.mjs             # strict rules (no-explicit-any, no-unused-vars)
└── tsconfig.json                 # strict + noUncheckedIndexedAccess, etc.
```

### Database Schema
Not yet defined. Datasource (`postgresql`) + generator only. Planned tables
(Step 2): `users`, `destinations`, `attractions`, `hidden_gems`,
`heritage_story`, `cultural_experiences`, `local_food`, `travel_tips`,
`local_events`, `search_history`, `saved_places`.

### Environment Variables
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string (pooled). |
| `BETTER_AUTH_SECRET` | Secret used to sign Better Auth sessions. |
| `BETTER_AUTH_URL` | App base URL (no trailing slash). |
| `OPENAI_API_KEY` | OpenAI Responses API key (AI + web search for events). |

Validated at runtime by `src/lib/env.ts` (fails fast on missing/invalid).

### API Endpoints
Planned (not yet implemented): `/api/auth/register`, `/api/auth/login`,
`/api/generate`, `/api/history`, `/api/profile`.

### Authentication Flow
Not yet implemented (Step 3, Better Auth). Planned: register → login → session
cookie → protected dashboard/profile → logout.

### AI Flow
Not yet implemented (Step 5). Planned: on cache miss, call OpenAI Responses API
to generate journalist-quality content, then persist to DB for reuse.

### Search Flow
Not yet implemented (Step 5). Planned: user searches destination → check DB → if
found, return cached data → if not, generate via AI → save → return.

### Data Flow
DB-first. Destination + child content served from PostgreSQL. Only `local_events`
refreshed dynamically via OpenAI web search and cached.

### Caching Strategy
Generated content is persisted permanently; future searches reuse cached rows.
Events are cached with periodic refresh (design in Step 7).

---

## Coding Standards
- Strict TypeScript, **no `any`** (ESLint-enforced).
- ESLint clean; unused vars error (prefix `_` to ignore).
- Reusable hooks/utilities/services; feature-based modules; no duplication.
- Validate all external input with Zod.
- Server-only modules (`env`, `prisma`) never imported into Client Components.

## Design System
- Material Design, **light theme only**. Feel: Google Travel / Airbnb / Tripadvisor — minimal, modern, premium, fast. No unnecessary animations.
- Primary `#2E7D32`, Secondary `#FF9800`, Background `#FAFAFA`, Cards white.
- Border radius `12px`. Font **Poppins** (via `next/font/google`).
- Tokens + theme in `src/theme/theme.ts`; applied via `ThemeRegistry`.

## Dependencies
Runtime: `next@16.2.10`, `react@19.2.4`, `@mui/material@9`, `@mui/icons-material`,
`@mui/material-nextjs`, `@emotion/*`, `@prisma/client@7`, `@prisma/adapter-pg`,
`pg`, `better-auth`, `zod@4`, `bcrypt`, `react-hook-form`, `@hookform/resolvers`,
`openai`.
Dev: `prisma@7`, `dotenv`, `typescript`, `eslint`, `eslint-config-next`,
`@types/*`.

## Current Sprint
Foundations → Database.

## Current Branch
`main`

## Last Completed Task
Step 1 — Project scaffold & foundations (build/typecheck/lint green).

## Next Task
Step 2 — Define the full Prisma relational schema (11 tables + relations) and
create the first migration. **Requires a real `DATABASE_URL` (Neon).**

## Known Issues
- `.env` currently holds placeholder values; DB connection untested until a real
  Neon `DATABASE_URL` is provided (needed for Step 2).

## Technical Debt
- None yet. (Note: `create-next-app` installed **Next 16**, not 15 as originally
  specified. Kept intentionally — same App Router, backward compatible.)

## Deployment Steps (Vercel)
1. Import the repo into Vercel.
2. Set env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `OPENAI_API_KEY`.
3. Build runs `postinstall` → `prisma generate`, then `next build`.
4. Run `prisma migrate deploy` against Neon (added to the pipeline in Step 2+).

## Future Improvements
- Consider `@prisma/adapter-neon` (serverless driver) for edge/serverless perf.
- Image handling / CDN for destination photos.

## Developer Notes
- Prisma 7 requires a **driver adapter** (no bundled engine). We use `PrismaPg`
  with the Neon connection string; client is generated to `src/generated/prisma`
  (gitignored, regenerated via `postinstall`).
- MUI v9: system shorthand props (`alignItems`, `fontWeight`, `textAlign`) go
  through `sx`, not as direct props.
- Next 16 ships bundled docs in `node_modules/next/dist/docs/` — consult before
  using unfamiliar APIs.

## Files Modified (Step 1)
Created/rewrote: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`,
`src/theme/theme.ts`, `src/theme/ThemeRegistry.tsx`, `src/lib/env.ts`,
`src/lib/prisma.ts`, `prisma/schema.prisma`, `prisma.config.ts`, `.env.example`,
`.env`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `.gitignore`,
`src/features/README.md`.
Removed: CNA demo assets (`page.module.css`, `*.svg` in `public/`).

## Database Migration History
None yet.

## Testing Status
No automated tests yet. Manual verification: `npm run typecheck`, `npm run lint`,
`npm run build` all pass.
