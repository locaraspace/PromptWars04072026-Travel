import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, type Session } from '@/lib/auth';

/**
 * Returns the current session (or null) in Server Components / Route Handlers.
 */
export async function getServerSession(): Promise<Session | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ?? null;
}

/**
 * Guards a protected server route: returns the session or redirects to /login.
 * Use at the top of protected Server Components (e.g. dashboard, profile).
 */
export async function requireSession(
  redirectTo = '/login',
): Promise<Session> {
  const session = await getServerSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}
