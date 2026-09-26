/**
 * One slugifier, shared by series and tag URLs, so "Design Dissection" and
 * "data-oriented-design" can't end up following different rules.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
