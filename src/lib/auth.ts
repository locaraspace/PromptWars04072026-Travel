import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

const BCRYPT_ROUNDS = 12;

/**
 * Origins Better Auth will accept requests from (CSRF/"Invalid origin" guard).
 * Includes the configured base URL plus Vercel-provided domains so both the
 * production alias and per-deployment/preview URLs work without manual updates.
 */
function getTrustedOrigins(): string[] {
  const origins = new Set<string>([env.BETTER_AUTH_URL]);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }
  return [...origins];
}

/**
 * Better Auth server instance (single source of truth for auth).
 *
 * - Persists via the Prisma adapter (users, sessions, accounts, verifications).
 * - Email + password auth with **bcrypt** password hashing (per project stack).
 * - Sessions are cookie-based; the secret/base URL come from validated env.
 */
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS),
      verify: ({ hash, password }: { hash: string; password: string }) =>
        bcrypt.compare(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
});

export type Session = typeof auth.$Infer.Session;
