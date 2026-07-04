import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FullDestination } from '@/features/destinations/service';
import type { DestinationContent } from '@/features/search/content-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    destination: { create: vi.fn() },
    searchHistory: { create: vi.fn(() => Promise.resolve()) },
  },
}));
vi.mock('@/features/destinations/service', () => ({
  getDestinationBySlug: vi.fn(),
  fullDestinationInclude: {},
}));
vi.mock('@/features/search/generate', () => ({
  generateDestinationContent: vi.fn(),
}));

import { searchDestination } from '@/features/search/service';
import { getDestinationBySlug } from '@/features/destinations/service';
import { generateDestinationContent } from '@/features/search/generate';
import { prisma } from '@/lib/prisma';

const getBySlug = vi.mocked(getDestinationBySlug);
const generate = vi.mocked(generateDestinationContent);
const createDestination = vi.mocked(prisma.destination.create);
const createHistory = vi.mocked(prisma.searchHistory.create);

const fakeDestination = { id: 'd1', slug: 'ayodhya' } as unknown as FullDestination;

const fakeContent: DestinationContent = {
  name: 'Hampi',
  slug: 'hampi',
  country: 'India',
  region: null,
  city: null,
  summary: 'Ruined capital of Vijayanagara.',
  description: 'Boulders and temples.',
  bestSeason: null,
  attractions: [],
  hiddenGems: [],
  heritageStory: { title: 'Vijayanagara', story: '...', era: null },
  culturalExperiences: [],
  localFood: [],
  travelTips: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('searchDestination', () => {
  it('returns cached data without calling the AI on a cache hit', async () => {
    getBySlug.mockResolvedValue(fakeDestination);

    const result = await searchDestination({ query: 'Ayodhya', userId: 'u1' });

    expect(result.cached).toBe(true);
    expect(result.destination).toBe(fakeDestination);
    expect(generate).not.toHaveBeenCalled();
    expect(createHistory).toHaveBeenCalledOnce();
  });

  it('generates and persists on a cache miss', async () => {
    getBySlug.mockResolvedValue(null);
    generate.mockResolvedValue(fakeContent);
    const persisted = { id: 'd2', slug: 'hampi' } as unknown as FullDestination;
    createDestination.mockResolvedValue(persisted as never);

    const result = await searchDestination({ query: 'Hampi', userId: 'u1' });

    expect(generate).toHaveBeenCalledOnce();
    expect(createDestination).toHaveBeenCalledOnce();
    expect(result.cached).toBe(false);
    expect(result.destination).toBe(persisted);
    expect(createHistory).toHaveBeenCalledOnce();
  });

  it('still resolves if writing search history fails', async () => {
    getBySlug.mockResolvedValue(fakeDestination);
    createHistory.mockRejectedValueOnce(new Error('db down'));

    const result = await searchDestination({ query: 'Ayodhya', userId: 'u1' });

    expect(result.cached).toBe(true);
  });
});
