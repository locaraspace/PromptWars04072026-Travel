import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getServerSession } from '@/lib/session';
import { apiError, apiSuccess } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { refreshEvents } from '@/features/events/service';

const refreshSchema = z.object({ slug: z.string().min(1) });

/**
 * POST /api/events — refresh (web-search) and return upcoming events for a
 * destination. Body: { slug }. Auth required.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError('Sign in required.', 401, 'UNAUTHORIZED');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body.', 400, 'INVALID_BODY');
  }

  const parsed = refreshSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('A valid slug is required.', 400, 'VALIDATION_ERROR');
  }

  const destination = await prisma.destination.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true, name: true },
  });
  if (!destination) {
    return apiError('Destination not found.', 404, 'NOT_FOUND');
  }

  try {
    const events = await refreshEvents(destination);
    return apiSuccess({ events });
  } catch (error) {
    console.error('[api/events] refresh failed:', error);
    return apiError(
      'We could not fetch events right now. Please try again.',
      502,
      'EVENTS_FAILED',
    );
  }
}
