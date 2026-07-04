import { zodTextFormat } from 'openai/helpers/zod';
import { openai, CONTENT_MODEL } from '@/lib/openai';
import {
  destinationContentSchema,
  type DestinationContent,
} from '@/features/search/content-schema';

const SYSTEM_PROMPT = `You are an award-winning travel journalist writing for a premium travel guide.
Your prose is vivid, sensory and authentic — never robotic or generic. You write
like a human who has actually been there, evoking atmosphere, sound and light.

Rules:
- NEVER write filler like "X is a famous place". Show, don't label.
- Celebrate authentic, local and lesser-known experiences over tourist clichés.
- Cultural experiences are the priority — make them specific, immersive and real.
- Heritage must be immersive storytelling that transports the reader, not dry history.
- Keep facts plausible and non-fabricated (no invented ticket prices as guarantees;
  frame costs as approximate ranges).
- Output must satisfy the provided JSON schema exactly.`;

function userPrompt(destination: string): string {
  return `Write a complete, immersive travel guide for: "${destination}".

Produce:
- name: the canonical destination name.
- slug: lowercase, hyphenated canonical slug (e.g. "ram-mandir-ayodhya").
- country, region, city (region/city may be null if not applicable).
- summary: one evocative sentence for a card.
- description: 2-3 rich paragraphs that make the place feel alive.
- bestSeason: the ideal time to visit.
- attractions: 4-6 notable attractions, each with a journalist-quality description.
- hiddenGems: 3-5 genuine hidden gems (why locals love it, why tourists miss it,
  best visiting time, photography tips, nearby food).
- heritageStory: one immersive heritage narrative (title, story, era).
- culturalExperiences: 4-6 authentic experiences (duration, approx cost, ideal time,
  local tips, family friendly, booking required, authenticity rating 1-5). THIS IS
  THE MOST IMPORTANT SECTION — make each one specific and real.
- localFood: 4-6 local dishes (where to try, type, price range, must-try flag).
- travelTips: 5-7 practical tips (category + tip).

If the destination is ambiguous, choose the most iconic real place matching the name.`;
}

/**
 * Generate rich, journalist-quality destination content via the OpenAI Responses
 * API with structured output. Throws if the model returns nothing parseable.
 */
export async function generateDestinationContent(
  destination: string,
): Promise<DestinationContent> {
  const response = await openai.responses.parse({
    model: CONTENT_MODEL,
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt(destination) },
    ],
    text: {
      format: zodTextFormat(destinationContentSchema, 'destination_content'),
    },
  });

  const content = response.output_parsed;
  if (!content) {
    throw new Error('AI did not return usable destination content.');
  }
  return content;
}
