import { getServerSession } from '@/lib/session';
import { apiError, apiSuccess } from '@/lib/api';

/** GET /api/profile — the current authenticated user's public profile. */
export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError('Sign in required.', 401, 'UNAUTHORIZED');

  const { id, name, email, emailVerified, image, createdAt } = session.user;
  return apiSuccess({
    profile: { id, name, email, emailVerified, image, createdAt },
  });
}
