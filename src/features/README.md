# Features

TravelAI uses a **feature-based architecture**. Each folder here owns one
product capability end-to-end and may contain its own `components/`, `hooks/`,
`services/`, `schemas/` (Zod), and `types.ts`. Shared, cross-feature building
blocks live in `src/components`, `src/lib`, and `src/types` instead.

| Feature         | Responsibility                                                        |
| --------------- | --------------------------------------------------------------------- |
| `auth`          | Register, login, logout, session, protected-route helpers (Better Auth) |
| `destinations`  | Destination detail: attractions, hidden gems, heritage, food, tips, culture |
| `search`        | Search box + DB-first → cache → AI-fallback search flow                |
| `dashboard`     | Authenticated dashboard shell: search, recent, saved, profile         |
| `profile`       | User profile view/edit                                                 |
| `history`       | Search history + saved places                                         |

**Rules**
- No duplicated code — extract shared logic to `src/lib` or `src/components`.
- Components are reusable and presentational where possible; data access lives in
  feature `services/` that call `src/lib/prisma` or the OpenAI service.
- Strict TypeScript, no `any`. Validate all external input with Zod.
