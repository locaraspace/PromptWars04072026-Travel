import { z } from 'zod';

/**
 * Zod schema for AI/web-search-sourced local events. Dates are modeled as
 * nullable ISO strings (`YYYY-MM-DD`) — web results are often approximate, so the
 * human-readable timing is also woven into `description`.
 */
const event = z.object({
  title: z.string(),
  description: z.string(),
  venue: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  sourceUrl: z.string().nullable(),
});

export const eventsSchema = z.object({
  events: z.array(event),
});

export type EventItem = z.infer<typeof event>;
export type EventsPayload = z.infer<typeof eventsSchema>;
