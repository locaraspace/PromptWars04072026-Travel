import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

/**
 * Relations that make up a complete destination page. Ordered so the most
 * relevant content surfaces first.
 */
export const fullDestinationInclude = {
  attractions: { orderBy: { createdAt: 'asc' } },
  hiddenGems: { orderBy: { createdAt: 'asc' } },
  heritageStory: true,
  culturalExperiences: { orderBy: { authenticityRating: 'desc' } },
  localFood: { orderBy: { createdAt: 'asc' } },
  travelTips: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.DestinationInclude;

export type FullDestination = Prisma.DestinationGetPayload<{
  include: typeof fullDestinationInclude;
}>;

/** Fetch a fully-populated destination by its slug, or null if not cached yet. */
export async function getDestinationBySlug(
  slug: string,
): Promise<FullDestination | null> {
  return prisma.destination.findUnique({
    where: { slug },
    include: fullDestinationInclude,
  });
}
