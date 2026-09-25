# x64tyko.github.io

My personal site and blog. Built with [Astro](https://astro.build), MDX, and
Tailwind CSS, deployed to GitHub Pages.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. Drafts are visible here. |
| `npm run build` | Type-checks, then builds to `dist/`. Drafts are excluded. |
| `npm run preview` | Serves the built output locally. |
| `npm run check` | Type-checks `.astro`, `.ts`, and `.tsx` without building. |

## Writing a post

Add an `.mdx` file to `src/content/posts/`. The filename becomes the URL, so
`src/content/posts/my-post.mdx` publishes at `/blog/my-post/`.

```mdx
---
title: A post about something
description: One or two sentences. Used for the post list, OG tags, and RSS.
date: 2026-09-24
tags: ['architecture', 'cpp']
draft: true
---

Markdown body goes here.
```

Frontmatter is validated against the schema in `src/content.config.ts` at build
time, so a missing `title` or a malformed `date` fails the build instead of
rendering a broken page.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | yes | Post list, `<meta description>`, OG tags, RSS. |
| `date` | yes | `YYYY-MM-DD`. Sorts the post list. |
| `tags` | no | Defaults to `[]`. |
| `draft` | no | Defaults to `false`. |
| `updated` | no | Shown next to the date, emitted as `article:modified_time`. |
| `series` | no | Groups a hub post with its spokes. |
| `canonicalUrl` | no | Set when the post is also published elsewhere. |

### Drafts

`draft: true` means: visible in `npm run dev`, excluded from the production
build, excluded from RSS, and `noindex` if reached directly. Flip it to `false`
to publish.

### Embedding a React component

Because posts are MDX, a post can import and render a React component. It only
ships JavaScript to pages that actually use one.

```mdx
import Demo from '@/components/Demo.tsx';

Here's the thing running:

<Demo client:load />
```

The `client:*` directive is required. Without it the component renders to
static HTML and won't be interactive. `client:load` hydrates immediately;
`client:visible` waits until it scrolls into view.

## Projects

Same idea, in `src/content/projects/`. Schema is in `src/content.config.ts`
(`name`, `description`, `order`, `status`, `tech`, `repo`, `link`, `draft`).

## Layout

```
src/
  components/      Header, Footer, PostCard, Prose, ThemeToggle
  content/
    posts/         Blog posts (.mdx)
    projects/      Project entries (.mdx)
  data/site.ts     Name, tagline, nav, social links
  layouts/         BaseLayout: <head>, meta tags, theme script
  pages/           Routes. [...slug].astro renders posts.
  styles/global.css  Tailwind theme: gold + purple palette, dark mode
public/            Served as-is (favicon, and CNAME if you add a domain)
```

## Deploying

Pushing to `master` triggers `.github/workflows/master.yml`, which builds and
deploys to GitHub Pages.

To move to a custom domain: add a `public/CNAME` file containing the bare
domain, and update `site` in `astro.config.mjs` so the sitemap, RSS, and
canonical URLs point at it.

## Generated for free

RSS at `/rss.xml`, `sitemap-index.xml`, `robots.txt`, and per-page Open Graph
and Twitter card tags.
