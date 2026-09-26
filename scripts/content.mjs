// Prints every piece of content with its track, series, status and filename.
// Finding a file by half-remembering its title gets old fast once the list
// grows past a screen.
//
//   npm run content              everything
//   npm run content -- ecs       filter on title, tags, series, track or file
//   npm run content -- --live    published only
//   npm run content -- --draft   drafts only
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';

const args = process.argv.slice(2);
const onlyLive = args.includes('--live');
const onlyDraft = args.includes('--draft');
const query = args.find((a) => !a.startsWith('--'))?.toLowerCase();

const collections = [
  ['src/content/posts', 'post'],
  ['src/content/reviews', 'review'],
  ['src/content/projects', 'project'],
];

const rows = [];

for (const [dir, kind] of collections) {
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
  } catch {
    continue;
  }

  for (const file of files) {
    const fm = parseFrontmatter(join(dir, file));
    const slug = file.replace(/\.mdx?$/, '');

    rows.push({
      title: fm.title ?? fm.name ?? slug,
      kind,
      // Reviews have no area field; they belong to the games track by nature.
      area: fm.area ?? (kind === 'review' ? 'games' : '-'),
      series: fm.subseries ? `${fm.series} / ${fm.subseries}` : (fm.series ?? '-'),
      live: fm.draft !== 'true',
      file: slug,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
    });
  }
}

const filtered = rows
  .filter((r) => (onlyLive ? r.live : true))
  .filter((r) => (onlyDraft ? !r.live : true))
  .filter((r) =>
    !query
      ? true
      : [r.title, r.file, r.series, r.area, r.kind, ...r.tags]
          .join(' ')
          .toLowerCase()
          .includes(query),
  )
  .sort(
    (a, b) =>
      Number(b.live) - Number(a.live) ||
      a.area.localeCompare(b.area) ||
      a.title.localeCompare(b.title),
  );

if (filtered.length === 0) {
  console.log(query ? `Nothing matching "${query}".` : 'No content found.');
  process.exit(0);
}

const widest = (key, min) =>
  Math.max(min, ...filtered.map((r) => String(r[key]).length));

const wTitle = Math.min(widest('title', 5), 46);
const wArea = widest('area', 5);
const wSeries = Math.min(widest('series', 6), 30);

const pad = (value, n) => {
  const s = String(value);
  return s.length > n ? `${s.slice(0, n - 1)}…` : s.padEnd(n);
};

console.log();
console.log(`  ${pad('TITLE', wTitle)}  ${pad('TRACK', wArea)}  ${pad('SERIES', wSeries)}  STATUS  FILE`);
console.log(`  ${'-'.repeat(wTitle)}  ${'-'.repeat(wArea)}  ${'-'.repeat(wSeries)}  ------  ----`);

for (const r of filtered) {
  const status = r.live ? 'live  ' : 'DRAFT ';
  console.log(
    `  ${pad(r.title, wTitle)}  ${pad(r.area, wArea)}  ${pad(r.series, wSeries)}  ${status}  ${r.file}`,
  );
}

const live = filtered.filter((r) => r.live).length;
console.log();
console.log(`  ${filtered.length} items, ${live} live, ${filtered.length - live} draft`);
console.log();
