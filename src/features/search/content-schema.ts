import { z } from 'zod';

/**
 * Zod schema for AI-generated destination content. Also used as the OpenAI
 * structured-output format (via `zodTextFormat`), so optional values are modeled
 * as `.nullable()` (OpenAI strict mode requires every key to be present).
 *
 * Content must read like professional travel journalism — the prompt enforces
 * tone; this schema enforces shape.
 */

const attraction = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().nullable(),
  area: z.string().nullable(),
  bestTime: z.string().nullable(),
  entryInfo: z.string().nullable(),
});

const hiddenGem = z.object({
  title: z.string(),
  description: z.string(),
  whyLocalsLove: z.string(),
  whyTouristsMiss: z.string(),
  bestVisitingTime: z.string(),
  photographyTips: z.string(),
  nearbyFood: z.string(),
});

const heritageStory = z.object({
  title: z.string(),
  story: z.string(),
  era: z.string().nullable(),
});

const culturalExperience = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  estimatedCost: z.string(),
  idealTime: z.string(),
  localTips: z.string(),
  familyFriendly: z.boolean(),
  bookingRequired: z.boolean(),
  authenticityRating: z.number().int().min(1).max(5),
});

const localFood = z.object({
  name: z.string(),
  description: z.string(),
  whereToTry: z.string().nullable(),
  type: z.string().nullable(),
  priceRange: z.string().nullable(),
  mustTry: z.boolean(),
});

const travelTip = z.object({
  category: z.string().nullable(),
  tip: z.string(),
});

export const destinationContentSchema = z.object({
  name: z.string(),
  slug: z.string(),
  country: z.string(),
  region: z.string().nullable(),
  city: z.string().nullable(),
  summary: z.string(),
  description: z.string(),
  bestSeason: z.string().nullable(),
  attractions: z.array(attraction),
  hiddenGems: z.array(hiddenGem),
  heritageStory,
  culturalExperiences: z.array(culturalExperience),
  localFood: z.array(localFood),
  travelTips: z.array(travelTip),
});

export type DestinationContent = z.infer<typeof destinationContentSchema>;
