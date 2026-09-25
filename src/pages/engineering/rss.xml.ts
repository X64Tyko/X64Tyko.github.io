import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByArea } from '@/lib/posts';
import { site } from '@/data/site';
import { trackById } from '@/data/tracks';

// Per-track feeds: someone subscribed for engine internals shouldn't be sent
// game reviews. The combined feed at /rss.xml still carries everything.
export async function GET(context: APIContext) {
  const track = trackById('engineering');
  const posts = await getPostsByArea('engineering');

  return rss({
    title: `${site.name} — ${track.label}`,
    description: track.blurb,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
