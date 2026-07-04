import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    localEvent: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));
vi.mock('@/features/events/generate', () => ({
  fetchEventsForDestination: vi.fn(),
}));

import { refreshEvents, getCachedEvents } from '@/features/events/service';
import { fetchEventsForDestination } from '@/features/events/generate';
import { prisma } from '@/lib/prisma';

const localEvent = vi.mocked(prisma.localEvent, true);
const fetchEvents = vi.mocked(fetchEventsForDestination);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCachedEvents', () => {
  it('maps rows to serializable DTOs with ISO date strings', async () => {
    localEvent.findMany.mockResolvedValue([
      {
        id: 'e1',
        title: 'Deepotsav',
        description: 'Lights festival.',
        venue: 'Ram Ki Paidi',
        startDate: new Date('2026-11-06T00:00:00.000Z'),
        endDate: null,
        sourceUrl: null,
      },
    ] as never);

    const events = await getCachedEvents('d1');

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: 'e1',
      title: 'Deepotsav',
      startDate: '2026-11-06T00:00:00.000Z',
      endDate: null,
    });
  });
});

describe('refreshEvents', () => {
  it('replaces the cached set and returns DTOs when events are found', async () => {
    fetchEvents.mockResolvedValue([
      {
        title: 'Ram Navami',
        description: 'Celebration.',
        venue: null,
        startDate: '2026-03-17',
        endDate: null,
        sourceUrl: null,
      },
    ]);
    localEvent.findMany.mockResolvedValue([
      {
        id: 'e2',
        title: 'Ram Navami',
        description: 'Celebration.',
        venue: null,
        startDate: new Date('2026-03-17T00:00:00.000Z'),
        endDate: null,
        sourceUrl: null,
      },
    ] as never);

    const events = await refreshEvents({ id: 'd1', name: 'Ayodhya' });

    expect(localEvent.deleteMany).toHaveBeenCalledWith({
      where: { destinationId: 'd1' },
    });
    expect(localEvent.createMany).toHaveBeenCalledOnce();
    expect(events[0]?.title).toBe('Ram Navami');
  });

  it('clears the cache and returns [] when no events are found', async () => {
    fetchEvents.mockResolvedValue([]);

    const events = await refreshEvents({ id: 'd1', name: 'Nowhere' });

    expect(localEvent.deleteMany).toHaveBeenCalledOnce();
    expect(localEvent.createMany).not.toHaveBeenCalled();
    expect(events).toEqual([]);
  });
});
