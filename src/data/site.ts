/**
 * Site-wide identity and links.
 *
 * TODO: replace the placeholder values below with your real details.
 * Everything here is rendered publicly.
 */
export const site = {
  /** Handle shown site-wide: header, page titles, RSS channel. */
  name: 'X64Tyko',
  /** Real name. Used on the About and Contact pages, and the footer copyright. */
  realName: 'Cody Pederson',
  /** Short role line used in the header and Open Graph tags. */
  title: 'Gameplay Systems Engineer',
  /** One sentence. Shown on the home page under your name. */
  tagline:
    'I build engines, gameplay systems, and the tools that keep them honest.',
  /** Used for the <meta name="description"> fallback and the RSS channel. */
  description:
    'Notes on engine architecture, gameplay systems, and performance-minded C++.',
  /** Shown in the footer. Set to null to hide the email link entirely. */
  email: null as string | null,
} as const;

/**
 * The post that explains what this site is, pinned on the home page so a
 * first-time visitor finds it instead of scrolling past it in Latest.
 * Set to null to remove the slot.
 */
export const startHere: string | null = 'rebuilding-this-site';

export type SocialLink = { label: string; href: string };

/** Rendered in the footer and on the contact page, in order. */
export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/X64Tyko' },
  // TODO: add the ones you actually want public, e.g.
  // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
  // { label: 'Mastodon', href: 'https://mastodon.social/@your-handle' },
];

/** Primary navigation. */
export const nav = [
  { label: 'Engineering', href: '/engineering/' },
  { label: 'Games', href: '/games/' },
  { label: 'Industry', href: '/industry/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;
