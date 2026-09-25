import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const reviews = (await getCollection('reviews', ({ data }) => !data.draft)).map(
    (review) => ({
      title: review.data.title,
      description: review.data.verdict ?? review.data.description,
      pubDate: review.data.date,
      categories: review.data.tags,
      link: `/reviews/${review.id}/`,
    }),
  );

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    ...reviews,
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${site.name} — Everything`,
    description: site.description,
    // context.site comes from `site` in astro.config.mjs.
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
