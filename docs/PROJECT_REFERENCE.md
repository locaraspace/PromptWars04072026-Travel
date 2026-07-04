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
🟢 **Step 3 complete — Authentication working end-to-end.** Better Auth
(email/password, **bcrypt** hashing) wired to Neon via the Prisma adapter;
register/login/logout, sessions, protected `/dashboard` + `/profile`, and edge
route-protection all verified against the live DB. Ready for Step 4 (Landing) or
Step 5 (Search + AI).

### Completed Features
- [x] **Step 1 — Scaffold & foundations**: Next.js 16 + TypeScript (strict) app,
  MUI v9 Material Design theme (light, Poppins, brand palette), Prisma 7 client
  with node-postgres driver adapter, validated env module, feature-based folder
  structure, ESLint (no `any`), `.env.example`, docs.
- [x] **Step 2 — Database schema**: 11 models + relations, `ContentSource` enum,
  cascade rules, indexes. Migration `init` applied to Neon and verified.
- [x] **Step 3 — Authentication**: Better Auth + Prisma adapter, bcrypt password
  hashing, `Session`/`Account`/`Verification` models + migration, `/api/auth/*`
  handler, login/register pages (RHF + Zod), sign-out, `requireSession` guard and
  `proxy.ts` edge protection. Verified: sign-up 200, session 200, bad login 401,
  bcrypt hash `$2b$12$…` in DB.

### Pending Features
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
Defined in `prisma/schema.prisma` (PascalCase models `@@map`-ed to snake_case
tables). String `cuid()` IDs throughout. Enum `ContentSource { SEED, AI_GENERATED }`.

| Model (table) | Key fields | Relations |
| --- | --- | --- |
| `User` (`users`) | name, email(unique), emailVerified, image, timestamps | → SearchHistory, SavedPlace |
| `Destination` (`destinations`) | slug(unique), name, city, region, country, summary, description, bestSeason, heroImageUrl, source | owns all content below; ← SearchHistory, SavedPlace |
| `Attraction` (`attractions`) | title, description, category, area, bestTime, entryInfo, imageUrl | → Destination (cascade) |
| `HiddenGem` (`hidden_gems`) | title, description, whyLocalsLove, whyTouristsMiss, bestVisitingTime, photographyTips, nearbyFood | → Destination (cascade) |
| `HeritageStory` (`heritage_story`) | title, story, era | **1–1** Destination (cascade) |
| `CulturalExperience` (`cultural_experiences`) | title, description, duration, estimatedCost, idealTime, localTips, familyFriendly, bookingRequired, authenticityRating(1–5) | → Destination (cascade) |
| `LocalFood` (`local_food`) | name, description, whereToTry, type, priceRange, mustTry | → Destination (cascade) |
| `TravelTip` (`travel_tips`) | category, tip | → Destination (cascade) |
| `LocalEvent` (`local_events`) | title, description, venue, startDate, endDate, sourceUrl, fetchedAt, expiresAt | → Destination (cascade); cache fields |
| `SearchHistory` (`search_history`) | query, normalizedQuery, destinationId? | → User (cascade), Destination (setNull) |
| `SavedPlace` (`saved_places`) | notes; unique(userId,destinationId) | → User (cascade), Destination (cascade) |

Auth satellite models **added in Step 3** (tables `sessions`, `accounts`,
`verifications`): `Session` (token, expiresAt, ip/agent, userId), `Account`
(providerId, accountId, `password` = bcrypt hash for email/password, tokens),
`Verification` (identifier, value, expiresAt). All cascade on user delete.

### Environment Variables
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string (pooled). |
| `BETTER_AUTH_SECRET` | Secret used to sign Better Auth sessions. |
| `BETTER_AUTH_URL` | App base URL (no trailing slash). |
| `OPENAI_API_KEY` | OpenAI Responses API key (AI + web search for events). |

Validated at runtime by `src/lib/env.ts` (fails fast on missing/invalid).

### API Endpoints
- **Auth (live)** — served by Better Auth under the catch-all
  `src/app/api/auth/[...all]/route.ts`: `POST /api/auth/sign-up/email`,
  `POST /api/auth/sign-in/email`, `POST /api/auth/sign-out`,
  `GET /api/auth/get-session`, plus other Better Auth routes. (These supersede the
  spec's `/api/auth/register` + `/login` names — approved deviation.)
- **Planned**: `/api/generate`, `/api/history`, `/api/profile`.

### Authentication Flow
1. **Register** — `RegisterForm` → `authClient.signUp.email` → Better Auth hashes
   the password with **bcrypt** (cost 12), creates `User` + `Account`, opens a
   `Session`, sets the session cookie.
2. **Login** — `LoginForm` → `authClient.signIn.email` → verifies bcrypt hash,
   opens a session.
3. **Session** — cookie-based, 7-day expiry, refreshed daily. Read on the server
   via `getServerSession()` / `requireSession()` (`src/lib/session.ts`).
4. **Protection** — `src/proxy.ts` (edge) optimistically redirects based on the
   session cookie; Server Components additionally call `requireSession()` for a
   real check. Guards `/dashboard` and `/profile`; authed users are bounced off
   `/login` + `/register`.
5. **Logout** — `SignOutButton` → `authClient.signOut` → clears session → `/login`.

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
Step 3 — Authentication (Better Auth + bcrypt) working end-to-end and verified
against Neon.

## Next Task
Step 4 — Landing page (Material Design hero + search entry), **or** jump to
Step 5 — Search flow + AI engine (DB-first → cache → OpenAI fallback → persist).
Recommend Step 5 next since it's the product core; landing polish can follow.

## Known Issues
- The developer's **local network blocks outbound port 5432**, so
  `prisma migrate` can't run from their machine (P1001). Workaround in use:
  migrations run from an unblocked environment. Alternatives: mobile hotspot, or
  paste `migrate diff` SQL into Neon's browser SQL Editor + `migrate resolve`.
- Minor: node-postgres prints an SSL/libpq-compat deprecation warning on connect
  (`sslmode=require`); harmless — connection succeeds.

## Technical Debt
- None yet. (Note: `create-next-app` installed **Next 16**, not 15 as originally
  specified. Kept intentionally — same App Router, backward compatible.)

## Deployment Steps (Vercel)
1. Import the repo into Vercel.
2. Set env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `OPENAI_API_KEY`.
3. Build runs `postinstall` → `prisma generate`, then `next build`.
4. Apply migrations to Neon with `npm run db:deploy` (`prisma migrate deploy`) —
   from Vercel's build or any network that isn't blocking port 5432.
5. Set `BETTER_AUTH_URL` to the deployed origin (e.g. `https://<app>.vercel.app`).

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

## Files Modified (Step 3 — Auth)
Created: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/session.ts`,
`src/proxy.ts`, `src/app/api/auth/[...all]/route.ts`,
`src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`,
`src/app/dashboard/page.tsx`, `src/app/profile/page.tsx`,
`src/features/auth/schemas.ts`, `src/features/auth/components/{AuthCard,LoginForm,RegisterForm,SignOutButton}.tsx`,
`src/theme/LinkBehavior.tsx`.
Updated: `prisma/schema.prisma` (auth models + User relations), `src/theme/theme.ts`
(LinkBehavior defaults), `src/app/page.tsx` (auth CTAs). Added migration
`20260704071320_add_auth_models`.

## Database Migration History
- `20260704070303_init` — **applied** ✅. All 11 domain tables + `ContentSource`
  enum, relations, cascades, indexes.
- `20260704071320_add_auth_models` — **applied** ✅. Better Auth tables
  `sessions`, `accounts`, `verifications` + relations to `users`.

> ⚠️ Prisma 7 gotcha: `prisma migrate dev` did **not** reliably refresh the
> generated client after adding models — run `npm run db:generate` (or rebuild)
> after any schema change, or Better Auth throws "Model account does not exist".

## Testing Status
No automated test suite yet. Manual verification (all green): `prisma validate`,
`npm run typecheck`, `npm run lint`, `npm run build`. **Auth E2E against Neon:**
sign-up → 200 + session; get-session → 200; wrong password → 401; DB password
stored as bcrypt `$2b$12$…`. Test users cleaned up afterward.
