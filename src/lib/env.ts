import { z } from 'zod';

/**
 * Server-side environment validation.
 *
 * Import `env` anywhere server code needs configuration. Parsing happens once at
 * module load; invalid or missing variables fail fast with a clear message
 * instead of surfacing as obscure runtime errors deep in the app.
 *
 * NOTE: never import this module from Client Components — these values must stay
 * on the server.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env: Env = parsed.data;
