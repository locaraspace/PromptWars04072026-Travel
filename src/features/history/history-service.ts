import { prisma } from '@/lib/prisma';

export interface RecentSearchItem {
  destinationId: string;
  slug: string;
  name: string;
  country: string;
  summary: string | null;
  searchedAt: Date;
}

/**
 * The user's most recent searches, de-duplicated by destination (keeping the
 * latest search for each), newest first.
 */
export async function getRecentSearches(
  userId: string,
  limit = 8,
): Promise<RecentSearchItem[]> {
  const rows = await prisma.searchHistory.findMany({
    where: { userId, destinationId: { not: null } },
    orderBy: { createdAt: 'desc' },
    distinct: ['destinationId'],
    take: limit,
    include: {
      destination: {
        select: { id: true, slug: true, name: true, country: true, summary: true },
      },
    },
  });

  return rows.flatMap((row) =>
    row.destination
      ? [
          {
            destinationId: row.destination.id,
            slug: row.destination.slug,
            name: row.destination.name,
            country: row.destination.country,
            summary: row.destination.summary,
            searchedAt: row.createdAt,
          },
        ]
      : [],
  );
}
