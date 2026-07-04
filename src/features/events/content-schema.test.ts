import { describe, it, expect } from 'vitest';
import { eventsSchema } from '@/features/events/content-schema';

describe('eventsSchema', () => {
  it('parses a valid events payload', () => {
    const result = eventsSchema.safeParse({
      events: [
        {
          title: 'Deepotsav',
          description: 'Festival of lights.',
          venue: 'Ram Ki Paidi',
          startDate: '2026-11-06',
          endDate: null,
          sourceUrl: 'https://example.com',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts an empty events list (no events found)', () => {
    expect(eventsSchema.safeParse({ events: [] }).success).toBe(true);
  });

  it('allows null dates/venue/url', () => {
    const result = eventsSchema.safeParse({
      events: [
        {
          title: 'Recurring fair',
          description: 'Happens periodically.',
          venue: null,
          startDate: null,
          endDate: null,
          sourceUrl: null,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an event missing a title', () => {
    const result = eventsSchema.safeParse({
      events: [{ description: 'x', venue: null, startDate: null, endDate: null, sourceUrl: null }],
    });
    expect(result.success).toBe(false);
  });
});
