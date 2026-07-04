import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

const BCRYPT_ROUNDS = 12;

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
