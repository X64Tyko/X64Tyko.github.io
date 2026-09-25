import type { CollectionEntry } from 'astro:content';

export type Review = CollectionEntry<'reviews'>;

/**
 * The overall score is derived from the section scores whenever the full
 * breakdown is present, so the headline number cannot drift away from the
 * parts it is made of. `score` in frontmatter is only a fallback, for reviews
 * written without a breakdown.
 */
export function overallScore(data: Review['data']): number | undefined {
  const sections = [
    data.scores?.gameplay,
    data.scores?.systems,
    data.scores?.uiux,
    data.scores?.artSound,
  ].filter((v): v is number => typeof v === 'number');

  if (sections.length === 4) {
    return sections.reduce((a, b) => a + b, 0) / sections.length;
  }

  return data.score;
}

/** 6 renders as "6", 6.5 as "6.5". Fractions are fine; trailing zeroes are not. */
export function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}
