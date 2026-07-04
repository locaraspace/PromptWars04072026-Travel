import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getServerSession } from '@/lib/session';
import { apiError, apiSuccess } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import {
  toggleSaved,
  getSavedDestinations,
} from '@/features/history/saved-service';

const toggleSchema = z.object({ destinationId: z.string().min(1) });

/** GET /api/saved — the user's bookmarked destinations. */
export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError('Sign in required.', 401, 'UNAUTHORIZED');

  const saved = await getSavedDestinations(session.user.id);
  return apiSuccess({ saved });
}

/** POST /api/saved — toggle a bookmark. Body: { destinationId }. */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError('Sign in required.', 401, 'UNAUTHORIZED');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body.', 400, 'INVALID_BODY');
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('A valid destinationId is required.', 400, 'VALIDATION_ERROR');
  }

  const destination = await prisma.destination.findUnique({
    where: { id: parsed.data.destinationId },
    select: { id: true },
  });
  if (!destination) {
    return apiError('Destination not found.', 404, 'NOT_FOUND');
  }

  const result = await toggleSaved(session.user.id, destination.id);
  return apiSuccess(result);
}
