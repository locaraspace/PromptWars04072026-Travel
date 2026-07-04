# TravelAI — Test Record

> A record of the testing performed during development. Each feature step was
> verified with static checks (typecheck / lint / production build) and, where it
> touches runtime behaviour, exercised live against the **real Neon database** and
> the **OpenAI API** via HTTP requests and direct DB queries.
>
> This is a manual/integration test log. Automated unit/e2e suites are **not yet**
> in the project (see "Gaps & next steps" at the end).

- **Last updated:** 2026-07-04
- **Environment:** Next.js 16, Node 24, Neon PostgreSQL (pooled), OpenAI Responses API
- **Method:** `npm run typecheck` / `npm run lint` / `npm run build`; `curl` against
  a local production server (`npm start`); direct SQL via the Prisma pg adapter.
- **Legend:** ✅ PASS · ❌ FAIL · 🔁 fixed then re-verified

---

## 1. Static quality gates (run after every step)

| ID | Check | Command | Expected | Result |
| --- | --- | --- | --- | --- |
| Q-1 | Type safety (strict, no `any`) | `npm run typecheck` | No errors | ✅ |
| Q-2 | Lint (incl. `no-explicit-any`) | `npm run lint` | No errors | ✅ |
| Q-3 | Production build | `npm run build` | Compiles; all routes emitted | ✅ |

Final build output verified 13 routes: `/`, `/login`, `/register` (static);
`/dashboard`, `/profile`, `/destination/[slug]` (dynamic, protected);
`/api/{auth,generate,history,saved,profile,events}`; Proxy (edge) active.

---

## 2. Database schema (Step 2)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| DB-1 | Schema validity | `prisma validate` | Schema is valid | ✅ |
| DB-2 | Migration `init` applies | `prisma migrate dev` | Migration applied | ✅ |
| DB-3 | All 11 domain tables created | SQL `pg_tables` query | 11 tables present | ✅ |
| DB-4 | Auth tables migration | `add_auth_models` migration | `sessions`, `accounts`, `verifications` created | ✅ |

Tables confirmed in `neondb.public`: `users`, `destinations`, `attractions`,
`hidden_gems`, `heritage_story`, `cultural_experiences`, `local_food`,
`travel_tips`, `local_events`, `search_history`, `saved_places`, `sessions`,
`accounts`, `verifications` (+ `_prisma_migrations`).

---

## 3. Authentication (Step 3)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| AUTH-1 | Register new user | `POST /api/auth/sign-up/email` | 200 + session token + user object | ✅ |
| AUTH-2 | Session established | `GET /api/auth/get-session` (with cookie) | 200 + valid session + user | ✅ |
| AUTH-3 | Wrong password rejected | `POST /api/auth/sign-in/email` (bad pw) | 401 `INVALID_EMAIL_OR_PASSWORD` | ✅ |
| AUTH-4 | Password hashed with bcrypt | SQL read of `accounts.password` | Hash matches `^$2[aby]$` (bcrypt) | ✅ |
| AUTH-5 | Protected route guarded | `GET /dashboard` while signed out | Redirect to `/login` (proxy + `requireSession`) | ✅ |

Evidence (AUTH-4): stored value `\$2b\$12\$514yKWbpzxuDulx.OJ…` → cost-12 bcrypt.

---

## 4. Search + AI engine (Step 5)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| GEN-1 | First search generates content | `POST /api/generate {query:"Ayodhya"}` | 200, `cached:false`, full guide | ✅ |
| GEN-2 | Journalist-quality prose | Inspect `description` | Vivid, non-robotic | ✅ |
| GEN-3 | All sections populated | Inspect response counts | 5 attractions, 5 cultural, 3 gems, heritage, 5 food, 6 tips | ✅ |
| GEN-4 | Content persisted | SQL counts by table | Rows created; `source = AI_GENERATED` | ✅ |
| GEN-5 | Repeat search hits cache | `POST /api/generate {query:"Ayodhya"}` again | 200, `cached:true`, no AI call | ✅ |
| GEN-6 | Latency: generate vs cache | Timed both calls | Generate ~29s; cache hit ~4s | ✅ |
| GEN-7 | Search history recorded | SQL `search_history` count | Row written per search | ✅ |

Sample (GEN-2): _"Dawn in Ayodhya stirs gently—the Ganga's cousin, Sarayu,
glimmers as priests in saffron whisper morning mantras into the pink-tinted fog…"_

---

## 5. Dashboard — recent, saved, profile (Step 6)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| DASH-1 | Save a destination | `POST /api/saved {destinationId}` | 200 `{saved:true}` | ✅ |
| DASH-2 | List saved | `GET /api/saved` | 200 + Ayodhya in list | ✅ |
| DASH-3 | Recent searches | `GET /api/history` | 200 + Ayodhya (deduped) | ✅ |
| DASH-4 | Profile fetch | `GET /api/profile` | 200 + user profile | ✅ |
| DASH-5 | Unsave (toggle off) | `POST /api/saved {destinationId}` again | 200 `{saved:false}` | ✅ |
| DASH-6 | Auth required (negative) | `GET /api/history` with no cookie | 401 `UNAUTHORIZED` | ✅ |

---

## 6. Events — dynamic web search + cache (Step 7)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| EV-1 | Web-search refresh | `POST /api/events {slug:"ayodhya"}` | 200 + real upcoming events | ✅ |
| EV-2 | Real, dated results | Inspect events | 6 events w/ dates + venues | ✅ |
| EV-3 | Events cached | SQL `local_events` count | 6 rows persisted | ✅ |
| EV-4 | Freshness (TTL) | SQL `expires_at > now()` | All 6 fresh (7-day TTL) | ✅ |
| EV-5 | Transaction robustness | (regression) | No P2028 after fix | 🔁 |

Sample (EV-2): _Ram Lalla Pratistha Diwas (2026-01-22), Ram Navami (2026-03-17),
Chhath Puja at Saryu Ghat (2026-10-28), Deepotsav / Diwali (2026-11-06)…_

**EV-5 note:** first attempt failed with Prisma `P2028` (interactive transaction
could not start on the pooled Neon adapter). Fixed by replacing the interactive
`$transaction` with sequential writes; re-tested → ✅.

---

## 7. Landing page + UI polish (Step 4)

| ID | Test case | Method | Expected | Result |
| --- | --- | --- | --- | --- |
| UI-1 | Build with new landing/headers | `npm run build` | Green; `/` prerendered | ✅ |
| UI-2 | Type + lint after polish | `npm run typecheck` / `lint` | No errors | ✅ |
| UI-3 | Image sources reachable | `curl -I` each Unsplash URL | HTTP 200 | ✅ |
| UI-4 | Visual review in browser | Manual (`npm run dev`) | — | ⏳ pending user confirmation |

---

## 8. Negative / edge cases exercised

| ID | Case | Expected | Result |
| --- | --- | --- | --- |
| NEG-1 | Unauthenticated API call | 401 `UNAUTHORIZED` | ✅ (DASH-6) |
| NEG-2 | Wrong password | 401 | ✅ (AUTH-3) |
| NEG-3 | Missing env vars at build | Fail fast w/ clear message | ✅ (`env.ts` validation) |
| NEG-4 | Unknown destination slug page | 404 not-found | ✅ (code path: `notFound()`) |

---

## Test data hygiene
All throwaway test users (`test_*`, `tester_*`, `s6_*`, `s7_*@example.com`) were
deleted after each run. Retained in the DB as genuine seed/cache: the user's own
account (`nandu@gmail.com`), the **Ayodhya** destination (+ children), and its
**6 cached events**.

---

## Gaps & next steps (recommended)
- **No automated test suite yet.** Recommended: add **Vitest** for unit tests
  (services: `slug`, `search-service` cache logic, `saved-service` toggle) and
  **Playwright** for e2e (register → search → save → events). Mock OpenAI in CI.
- Add request-validation tests for `/api/generate` (invalid/missing `query`).
- Add a CI workflow running `typecheck` + `lint` + `build` on every PR.
