/**
 * The site splits along a soft line between hard-systems engineering writing
 * and game design work. Tracks are defined here so the hub pages, navigation
 * and per-track feeds cannot drift apart.
 */
export type AreaId = 'engineering' | 'games';

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
];

export const trackById = (id: AreaId): Track =>
  tracks.find((t) => t.id === id) ?? tracks[0];
