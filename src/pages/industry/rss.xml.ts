import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByArea } from '@/lib/posts';
import { site } from '@/data/site';
import { trackById } from '@/data/tracks';

// Per-track feed. The combined feed at /rss.xml still carries everything.
export async function GET(context: APIContext) {
  const track = trackById('industry');
  const posts = await getPostsByArea('industry');

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
