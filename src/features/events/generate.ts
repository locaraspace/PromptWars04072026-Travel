import { zodTextFormat } from 'openai/helpers/zod';
import { openai, CONTENT_MODEL } from '@/lib/openai';
import { eventsSchema, type EventItem } from '@/features/events/content-schema';

const SYSTEM_PROMPT = `You are a local events researcher. Using live web search, find
real, upcoming festivals, cultural events, fairs and notable happenings for the
given destination. Only include events that are plausibly upcoming or recurring.
Prefer authentic local and cultural events. If you cannot find real events, return
an empty list rather than inventing any. Weave dates/timing naturally into each
description, and set startDate/endDate to ISO (YYYY-MM-DD) only when confident.`;

/**
 * Fetch upcoming local events for a destination using the OpenAI Responses API
 * with the built-in `web_search` tool, returned as structured data.
 */
export async function fetchEventsForDestination(
  destinationName: string,
): Promise<EventItem[]> {
  const today = new Date().toISOString().slice(0, 10);

  const response = await openai.responses.parse({
    model: CONTENT_MODEL,
    tools: [{ type: 'web_search' }],
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Today is ${today}. Find up to 6 upcoming or recurring festivals and
cultural events in or near "${destinationName}". Return them as structured data.`,
      },
    ],
    text: {
      format: zodTextFormat(eventsSchema, 'local_events'),
    },
  });

  return response.output_parsed?.events ?? [];
}
