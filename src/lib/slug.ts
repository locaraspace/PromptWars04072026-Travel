/**
 * Turn arbitrary text into a URL/cache-safe slug.
 * "Ram Mandir, Ayodhya!" -> "ram-mandir-ayodhya"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-'); // collapse repeats
}

/**
 * Normalize a raw search query for consistent cache lookups. Collapses
 * whitespace and lowercases; used as the `normalizedQuery` in search history.
 */
export function normalizeQuery(input: string): string {
  return input.trim().replace(/\s+/g, ' ').toLowerCase();
}
