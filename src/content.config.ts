import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Drafts are visible in `astro dev` but excluded from production builds. */
    draft: z.boolean().default(false),
    /** Set false to close comments on a single post. */
    comments: z.boolean().default(true),
    /** Set when a post is also published elsewhere, so search engines credit this copy. */
    canonicalUrl: z.url().optional(),
    /**
     * Which track this belongs to. Engineering is the hard-systems writing;
     * games covers design, reviews and devlog material.
     */
    area: z.enum(['engineering', 'games']).default('engineering'),
    /** Groups a hub article with its spokes. */
    series: z.string().optional(),
    /** Pins reading order within a series. Falls back to date, then title. */
    seriesOrder: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    area: z.enum(['engineering', 'games']).default('engineering'),
    /** Lower sorts first on the projects page. */
    order: z.number().default(99),
    status: z.enum(['active', 'paused', 'shipped', 'exploring']).default('active'),
    tech: z.array(z.string()).default([]),
    repo: z.url().optional(),
    link: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Post title. Usually "Review: <game>". */
    title: z.string(),
    /** One or two sentences. Used on the index, in meta tags and in RSS. */
    description: z.string(),
    date: z.coerce.date(),
    /** The game itself, separate from the post title. */
    game: z.string(),
    developer: z.string().optional(),
    genre: z.string().optional(),
    platforms: z.array(z.string()).default([]),
    datePlayed: z.string().optional(),
    /** Hours on the clock when the review was written. */
    hoursPlayed: z.number().optional(),
    /** Asking price at time of review, as displayed. */
    price: z.string().optional(),
    /** The 1-3 sentence bottom line, shown before the body. */
    verdict: z.string().optional(),
    /** Overall, out of 10. */
    score: z.number().min(0).max(10).optional(),
    /** Optional breakdown, matching the review template's final-score block. */
    scores: z
      .object({
        gameplay: z.number().min(0).max(10).optional(),
        systems: z.number().min(0).max(10).optional(),
        uiux: z.number().min(0).max(10).optional(),
        artSound: z.number().min(0).max(10).optional(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    comments: z.boolean().default(true),
  }),
});

export const collections = { posts, projects, reviews };
