// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Slugs of posts marked `draft: true`, read straight from frontmatter.
 * The sitemap filter only receives a URL string, so draft status has to be
 * resolved here rather than from the content collection.
 */
const draftSlugs = new Set(
  readdirSync('src/content/posts')
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) =>
      /^draft:\s*true\s*$/m.test(
        readFileSync(`src/content/posts/${f}`, 'utf8').split(/^---$/m)[1] ?? '',
      ),
    )
    .map((f) => f.replace(/\.mdx?$/, '')),
);

/** @param {string} url */
const isDraftUrl = (url) =>
  [...draftSlugs].some((slug) => url.endsWith(`/blog/${slug}/`));

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs for the sitemap, RSS feed, and Open Graph tags.
  // Change this if you move to a custom domain (and add a public/CNAME file).
  site: 'https://x64tyko.github.io',

  integrations: [
    mdx(),
    react(),
    // Draft posts are built as unlisted pages, so keep them out of the sitemap.
    // They also carry `noindex`; this just avoids advertising them.
    sitemap({ filter: (page) => !isDraftUrl(page) }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
