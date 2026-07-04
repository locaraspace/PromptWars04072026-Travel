import OpenAI from 'openai';
import { env } from '@/lib/env';

/**
 * OpenAI client singleton. Cached on the global object to avoid re-creating the
 * client on every hot-reload in development.
 */
const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

export const openai =
  globalForOpenAI.openai ?? new OpenAI({ apiKey: env.OPENAI_API_KEY });

if (env.NODE_ENV !== 'production') {
  globalForOpenAI.openai = openai;
}

/** Model used for destination content generation. */
export const CONTENT_MODEL = 'gpt-4.1';
