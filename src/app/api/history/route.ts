import { getServerSession } from '@/lib/session';
import { apiError, apiSuccess } from '@/lib/api';
import { getRecentSearches } from '@/features/history/history-service';

/** GET /api/history — the user's recent searches (deduped by destination). */
export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError('Sign in required.', 401, 'UNAUTHORIZED');

  const recent = await getRecentSearches(session.user.id);
  return apiSuccess({ recent });
}
