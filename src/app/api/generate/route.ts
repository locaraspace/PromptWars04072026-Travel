import type { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/session';
import { apiError, apiSuccess } from '@/lib/api';
import { searchRequestSchema } from '@/features/search/schemas';
import { searchDestination } from '@/features/search/service';

/**
 * POST /api/generate
 * Body: { query: string }
 * Auth required. Runs the DB-first → AI-fallback search flow and returns the
 * fully-populated destination plus whether it came from cache.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return apiError('You must be signed in to search.', 401, 'UNAUTHORIZED');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body.', 400, 'INVALID_BODY');
  }

  const parsed = searchRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? 'Invalid search request.';
    return apiError(message, 400, 'VALIDATION_ERROR');
  }

  try {
    const result = await searchDestination({
      query: parsed.data.query,
      userId: session.user.id,
    });
    return apiSuccess({
      destination: result.destination,
      cached: result.cached,
    });
  } catch (error) {
    console.error('[api/generate] generation failed:', error);
    return apiError(
      'We could not build this destination right now. Please try again.',
      502,
      'GENERATION_FAILED',
    );
  }
}
