import { prisma } from '@/lib/prisma';
import { fetchEventsForDestination } from '@/features/events/generate';

/** Serializable event shape used by the API and client components. */
export interface EventDTO {
  id: string;
  title: string;
  description: string;
  venue: string | null;
  startDate: string | null;
  endDate: string | null;
  sourceUrl: string | null;
}

/** Cached events are considered fresh for this long before a refresh is offered. */
export const EVENTS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDTO(event: {
  id: string;
  title: string;
  description: string;
  venue: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sourceUrl: string | null;
}): EventDTO {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    venue: event.venue,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    endDate: event.endDate ? event.endDate.toISOString() : null,
    sourceUrl: event.sourceUrl,
  };
}

/** Cached events for a destination, soonest first. */
export async function getCachedEvents(
  destinationId: string,
): Promise<EventDTO[]> {
  const events = await prisma.localEvent.findMany({
    where: { destinationId },
    orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
  });
  return events.map(toDTO);
}

/** True when the destination has at least one non-expired cached event. */
export async function hasFreshEvents(destinationId: string): Promise<boolean> {
  const fresh = await prisma.localEvent.findFirst({
    where: { destinationId, expiresAt: { gt: new Date() } },
    select: { id: true },
  });
  return fresh != null;
}

/**
 * Refresh events via web search and replace the cached set for a destination.
 * Runs in a transaction so the page never sees a half-updated event list.
 */
export async function refreshEvents(destination: {
  id: string;
  name: string;
}): Promise<EventDTO[]> {
  const found = await fetchEventsForDestination(destination.name);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EVENTS_TTL_MS);

  // Replace the cached set. Sequential (not an interactive transaction) to avoid
  // connection-acquisition timeouts with the pooled Neon adapter; a failed insert
  // simply leaves the list empty until the next refresh — acceptable for events.
  await prisma.localEvent.deleteMany({ where: { destinationId: destination.id } });

  if (found.length === 0) return [];

  await prisma.localEvent.createMany({
    data: found.map((e) => ({
      destinationId: destination.id,
      title: e.title,
      description: e.description,
      venue: e.venue,
      startDate: parseDate(e.startDate),
      endDate: parseDate(e.endDate),
      sourceUrl: e.sourceUrl,
      fetchedAt: now,
      expiresAt,
    })),
  });

  const created = await prisma.localEvent.findMany({
    where: { destinationId: destination.id },
    orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
  });

  return created.map(toDTO);
}
