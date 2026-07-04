import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { env } from '@/lib/env';

/**
 * Prisma client singleton.
 *
 * Prisma 7 connects through a driver adapter rather than a bundled engine; we
 * use the node-postgres adapter (`PrismaPg`) pointed at the Neon connection
 * string. The pool is lazy — no connection is opened until the first query.
 *
 * In development, Next.js hot-reloading would otherwise create a new client on
 * every change and exhaust database connections, so we cache the instance on the
 * global object and reuse it across reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
