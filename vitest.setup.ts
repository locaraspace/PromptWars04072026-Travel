/**
 * Test setup: provide dummy env vars so any module that transitively imports
 * `@/lib/env` (which validates on load) does not throw during unit tests. Real
 * external calls (DB, OpenAI) are mocked in the tests themselves.
 */
process.env.DATABASE_URL ||= 'postgresql://user:pass@localhost:5432/testdb';
process.env.BETTER_AUTH_SECRET ||= '0123456789abcdef0123456789abcdef';
process.env.BETTER_AUTH_URL ||= 'http://localhost:3000';
process.env.OPENAI_API_KEY ||= 'sk-test-placeholder';
// NODE_ENV is set to 'test' by Vitest automatically (and is read-only in types).
