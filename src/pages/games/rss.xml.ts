import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getPostsByArea } from '@/lib/posts';
import { site } from '@/data/site';
import { trackById } from '@/data/tracks';

// The games track is posts AND reviews, so its feed has to carry both or it
// reports an empty track while reviews are being published.
export async function GET(context: APIContext) {
  const track = trackById('games');

  const posts = (await getPostsByArea('games')).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    categories: post.data.tags,
    link: `/blog/${post.id}/`,
  }));

  const reviews = (await getCollection('reviews', ({ data }) => !data.draft)).map(
    (review) => ({
      title: review.data.title,
      description: review.data.verdict ?? review.data.description,
      pubDate: review.data.date,
      categories: review.data.tags,
      link: `/reviews/${review.id}/`,
    }),
  );

  const items = [...posts, ...reviews].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );

  return rss({
    title: `${site.name} — ${track.label}`,
    description: track.blurb,
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
