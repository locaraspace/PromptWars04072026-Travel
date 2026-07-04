import { describe, it, expect } from 'vitest';
import { searchRequestSchema } from '@/features/search/schemas';

describe('searchRequestSchema', () => {
  it('accepts a valid query and trims it', () => {
    const result = searchRequestSchema.safeParse({ query: '  Ayodhya  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.query).toBe('Ayodhya');
  });

  it('rejects a too-short query', () => {
    expect(searchRequestSchema.safeParse({ query: 'a' }).success).toBe(false);
  });

  it('rejects a missing query', () => {
    expect(searchRequestSchema.safeParse({}).success).toBe(false);
  });

  it('rejects an over-long query', () => {
    expect(
      searchRequestSchema.safeParse({ query: 'x'.repeat(121) }).success,
    ).toBe(false);
  });
});
