/**
 * Comments are provided by giscus, which stores threads as GitHub Discussions
 * on this repo. Commenters sign in with GitHub, which is also what keeps the
 * spam out: there are no anonymous posts to moderate.
 *
 * SETUP, once, before flipping `enabled` to true:
 *
 *   1. Repo Settings -> General -> Features -> tick "Discussions".
 *   2. Install the giscus GitHub App on this repo:
 *      https://github.com/apps/giscus
 *   3. In Discussions, create a category named "Comments". Pick the
 *      "Announcement" format so only you can open new threads and giscus
 *      creates them on demand.
 *   4. Go to https://giscus.app, enter the repo, and copy the two generated
 *      values into `repoId` and `categoryId` below. They are public
 *      identifiers, not secrets.
 *   5. Set `enabled: true`.
 *
 * Until then the comment section renders a setup note in dev and nothing at
 * all in production.
 */
interface CommentsConfig {
  enabled: boolean;
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  reactionsEnabled: boolean;
  inputPosition: 'top' | 'bottom';
  lang: string;
}

export const comments: CommentsConfig = {
  /** Flip once repoId and categoryId are filled in. */
  enabled: true,

  /** Must be a public repo with Discussions turned on. */
  repo: 'X64Tyko/X64Tyko.github.io',

  repoId: 'R_kgDONl-ZHA',

  category: 'Comments',

  categoryId: 'DIC_kwDONl-ZHM4DGVu7',

  /**
   * How a page maps to its discussion.
   *
   * `og:title` rather than `title`, deliberately. Our <title> is
   * "Post Title - Site Name", so `title` mapping would key every thread on a
   * string containing the site name and the separator character, and changing
   * either would orphan every thread at once. og:title is the bare article
   * title, which is the thing actually intended to be the identity.
   *
   * The rule this imposes: article titles must be unique across posts AND
   * reviews, since they share this namespace. `scripts/check-titles.mjs`
   * enforces that at build time rather than leaving it to discipline.
   *
   * Still true either way: retitling a published article orphans its thread.
   */
  mapping: 'og:title',

  /** Reactions on the post itself, shown above the thread. */
  reactionsEnabled: true,

  /** Put the box above the thread so replying doesn't mean scrolling past it. */
  inputPosition: 'top',

  lang: 'en',
};

export const commentsConfigured =
  comments.enabled && comments.repoId !== '' && comments.categoryId !== '';
