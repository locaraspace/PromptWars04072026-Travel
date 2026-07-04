import { prisma } from '@/lib/prisma';

export interface SavedItem {
  destinationId: string;
  slug: string;
  name: string;
  country: string;
  summary: string | null;
  savedAt: Date;
}

/** Whether the user has bookmarked a given destination. */
export async function isSaved(
  userId: string,
  destinationId: string,
): Promise<boolean> {
  const existing = await prisma.savedPlace.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
    select: { id: true },
  });
  return existing != null;
}

/** Toggle a bookmark. Returns the resulting saved state. */
export async function toggleSaved(
  userId: string,
  destinationId: string,
): Promise<{ saved: boolean }> {
  const existing = await prisma.savedPlace.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.savedPlace.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await prisma.savedPlace.create({ data: { userId, destinationId } });
  return { saved: true };
}

/** The user's bookmarked destinations, newest first. */
export async function getSavedDestinations(
  userId: string,
): Promise<SavedItem[]> {
  const rows = await prisma.savedPlace.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      destination: {
        select: { id: true, slug: true, name: true, country: true, summary: true },
      },
    },
  });

  return rows.map((row) => ({
    destinationId: row.destination.id,
    slug: row.destination.slug,
    name: row.destination.name,
    country: row.destination.country,
    summary: row.destination.summary,
    savedAt: row.createdAt,
  }));
}
