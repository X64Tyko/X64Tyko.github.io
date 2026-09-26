import { getCollection } from 'astro:content';
import { slugify } from '@/lib/slug';

/**
 * Tags span posts and reviews, so a tag page has to gather from both. This
 * flattens the two collections into one shape rather than making every page
 * branch on which kind it is holding.
 */
export interface TaggedItem {
  title: string;
  description: string;
  date: Date;
  href: string;
  kind: 'post' | 'review';
  draft: boolean;
}

export interface Tag {
  name: string;
  slug: string;
  items: TaggedItem[];
}

/** Drafts appear in `astro dev` and are absent from production, as elsewhere. */
const visible = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !data.draft;

export async function getTags(): Promise<Tag[]> {
  const posts = await getCollection('posts', visible);
  const reviews = await getCollection('reviews', visible);

  const items: Array<TaggedItem & { tags: string[] }> = [
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      href: `/blog/${p.id}/`,
      kind: 'post' as const,
      draft: p.data.draft,
      tags: p.data.tags,
    })),
    ...reviews.map((r) => ({
      title: r.data.title,
      description: r.data.verdict ?? r.data.description,
      date: r.data.date,
      href: `/reviews/${r.id}/`,
      kind: 'review' as const,
      draft: r.data.draft,
      tags: r.data.tags,
    })),
  ];

  const byName = new Map<string, TaggedItem[]>();

  for (const { tags, ...item } of items) {
    for (const tag of tags) {
      const list = byName.get(tag);
      if (list) list.push(item);
      else byName.set(tag, [item]);
    }
  }

  return [...byName]
    .map(([name, list]) => ({
      name,
      slug: slugify(name),
      items: list.sort((a, b) => b.date.valueOf() - a.date.valueOf()),
    }))
    // Biggest tags first, alphabetical within a count, so the index reads as a
    // map of what the site is actually about.
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name));
}
