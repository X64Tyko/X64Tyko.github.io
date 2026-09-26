/**
 * The site splits along a soft line between hard-systems engineering writing
 * and game design work. Tracks are defined here so the hub pages, navigation
 * and per-track feeds cannot drift apart.
 */
export type AreaId = 'engineering' | 'games' | 'industry';

export interface Track {
  id: AreaId;
  label: string;
  href: string;
  tagline: string;
  /** Shown on the hub page under the heading. */
  blurb: string;
}

export const tracks: Track[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    href: '/engineering/',
    tagline: 'Engines, memory layout, and the cost of abstractions.',
    blurb:
      'Systems work: engine architecture, data-oriented design, and hard looks at patterns that get repeated without their reasons.',
  },
  {
    id: 'games',
    label: 'Games',
    href: '/games/',
    tagline: 'Design, systems, and games taken apart to see what they teach.',
    blurb:
      'The design side: mechanics and economies, reviews read for their systems rather than their scores, and notes from things being built.',
  },
  /**
   * EDITORIAL STANDARD for this track. It is the reason the track exists, so
   * it belongs next to the definition rather than copied into each draft.
   *
   * Do not assume. Extrapolation and educated guesses are usually the only
   * thing available from outside a company, and that is fine, but label them
   * as guesses rather than smuggling them in as findings.
   *
   * Where the facts are unclear there are normally several plausible paths,
   * and they branch further the deeper you dig. Present the two or three most
   * likely readings and say what evidence would separate them, instead of
   * picking one and asserting it.
   *
   * This is the differentiator. The default coverage is built for engagement:
   * take the angriest available explanation, swing at the easiest target, lose
   * every bit of subtlety on the way. Laying out the branch points is more
   * useful and harder to do, which is exactly why it is worth doing.
   *
   * "I don't know, and here are the three ways it could have gone" is not a
   * weaker piece than a confident single cause. It is the more honest one, and
   * on the internet it is also the rarer one.
   */
  {
    id: 'industry',
    label: 'Industry',
    href: '/industry/',
    tagline: 'An industry in turmoil, and the constraints behind the decisions.',
    blurb:
      'Critique and analysis of the games industry, which is in enough of a state right now to deserve some. Interested in the constraints people actually work under, and in following those constraints up the chain until you find whoever chose them. Where the facts run out, the honest answer is usually several plausible explanations rather than one confident one.',
  },
];

export const trackById = (id: AreaId): Track =>
  tracks.find((t) => t.id === id) ?? tracks[0];
