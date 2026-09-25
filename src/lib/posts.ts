import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Drafts are visible in `astro dev` and excluded from production builds. */
export const isVisible = ({ data }: Post) => import.meta.env.DEV || !data.draft;

/**
 * Every post, drafts included. Used for page generation, series membership and
 * series pages, so that a link to a draft resolves instead of 404ing. Drafts
 * are built with `noindex` and stay out of the front-door listings below.
 */
export async function getAllPosts(): Promise<Post[]> {
  return getCollection('posts');
}

/** Published only. For the front-door surfaces: home, blog index, RSS. */
export async function getVisiblePosts(): Promise<Post[]> {
  return getCollection('posts', isVisible);
}

/** Posts in one track, newest first. */
export async function getPostsByArea(area: 'engineering' | 'games'): Promise<Post[]> {
  return (await getVisiblePosts())
    .filter((p) => p.data.area === area)
    .sort(byNewest);
}

/** Newest first. Used by the blog index and the home page. */
export const byNewest = (a: Post, b: Post) =>
  b.data.date.valueOf() - a.data.date.valueOf();

/**
 * Series reading order: an explicit `seriesOrder` wins, then date, then title.
 * The last two are tiebreakers only, so that a series whose posts share a date
 * still renders in a stable order instead of whatever the loader happened to
 * return. Set `seriesOrder` when the reading order actually matters.
 */
export const bySeriesOrder = (a: Post, b: Post) =>
  (a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) ||
  a.data.date.valueOf() - b.data.date.valueOf() ||
  a.data.title.localeCompare(b.data.title);

/** "Code Critical" -> "code-critical" */
export function seriesSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Every series and its posts, drafts included, each list in reading order. */
export async function getSeriesMap(): Promise<Map<string, Post[]>> {
  const posts = await getAllPosts();
  const map = new Map<string, Post[]>();

  for (const post of posts) {
    const name = post.data.series;
    if (!name) continue;

    const list = map.get(name);
    if (list) list.push(post);
    else map.set(name, [post]);
  }

  for (const list of map.values()) list.sort(bySeriesOrder);
  return map;
}

export interface SeriesContext {
  name: string;
  href: string;
  part: number;
  total: number;
  prev: Post | null;
  next: Post | null;
}

/** Where `post` sits in its series, or null if it isn't in one. */
export async function getSeriesContext(post: Post): Promise<SeriesContext | null> {
  const name = post.data.series;
  if (!name) return null;

  const siblings = (await getSeriesMap()).get(name);
  if (!siblings) return null;

  const i = siblings.findIndex((p) => p.id === post.id);
  if (i === -1) return null;

  return {
    name,
    href: `/series/${seriesSlug(name)}/`,
    part: i + 1,
    total: siblings.length,
    prev: siblings[i - 1] ?? null,
    next: siblings[i + 1] ?? null,
  };
}
