import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    savedPlace: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { toggleSaved, isSaved } from '@/features/history/saved-service';
import { prisma } from '@/lib/prisma';

const savedPlace = vi.mocked(prisma.savedPlace, true);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('toggleSaved', () => {
  it('creates a bookmark when none exists (→ saved:true)', async () => {
    savedPlace.findUnique.mockResolvedValue(null);
    savedPlace.create.mockResolvedValue({ id: 's1' } as never);

    const result = await toggleSaved('u1', 'd1');

    expect(result).toEqual({ saved: true });
    expect(savedPlace.create).toHaveBeenCalledWith({
      data: { userId: 'u1', destinationId: 'd1' },
    });
    expect(savedPlace.delete).not.toHaveBeenCalled();
  });

  it('removes an existing bookmark (→ saved:false)', async () => {
    savedPlace.findUnique.mockResolvedValue({ id: 's1' } as never);
    savedPlace.delete.mockResolvedValue({ id: 's1' } as never);

    const result = await toggleSaved('u1', 'd1');

    expect(result).toEqual({ saved: false });
    expect(savedPlace.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    expect(savedPlace.create).not.toHaveBeenCalled();
  });
});

describe('isSaved', () => {
  it('returns true when a bookmark exists', async () => {
    savedPlace.findUnique.mockResolvedValue({ id: 's1' } as never);
    await expect(isSaved('u1', 'd1')).resolves.toBe(true);
  });

  it('returns false when no bookmark exists', async () => {
    savedPlace.findUnique.mockResolvedValue(null);
    await expect(isSaved('u1', 'd1')).resolves.toBe(false);
  });
});
