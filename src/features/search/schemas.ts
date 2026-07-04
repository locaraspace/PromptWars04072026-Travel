import { z } from 'zod';

export const searchRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, 'Enter a destination to explore')
    .max(120, 'That destination name is too long'),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
