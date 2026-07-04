import { describe, it, expect } from 'vitest';
import { slugify, normalizeQuery } from '@/lib/slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Ram Mandir Ayodhya')).toBe('ram-mandir-ayodhya');
  });

  it('strips punctuation and collapses separators', () => {
    expect(slugify('Ram Mandir, Ayodhya!')).toBe('ram-mandir-ayodhya');
    expect(slugify('  Hampi   Ruins  ')).toBe('hampi-ruins');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('***Varanasi***')).toBe('varanasi');
  });

  it('produces a stable key regardless of surrounding whitespace/case', () => {
    expect(slugify('  AYODHYA ')).toBe(slugify('ayodhya'));
  });
});

describe('normalizeQuery', () => {
  it('trims, lowercases and collapses inner whitespace', () => {
    expect(normalizeQuery('  Taj   Mahal ')).toBe('taj mahal');
  });

  it('treats differently-cased inputs as equal', () => {
    expect(normalizeQuery('Jaipur')).toBe(normalizeQuery('  jaipur '));
  });
});
