import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

/**
 * Better Auth catch-all handler. Exposes all auth endpoints under `/api/auth/*`
 * (sign-up/email, sign-in/email, sign-out, get-session, …).
 */
export const { GET, POST } = toNextJsHandler(auth);
