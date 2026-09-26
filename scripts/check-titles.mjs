// Comment threads are keyed on og:title, which is the bare article title, so
// two articles sharing a title would silently share a comment thread. This
// turns that convention into a build failure instead of a discipline problem.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';

const dirs = ['src/content/posts', 'src/content/reviews'];
const seen = new Map();
const clashes = [];

for (const dir of dirs) {
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
  } catch {
    continue; // collection not present yet
  }

  for (const file of files) {
    const path = join(dir, file);
    const { title } = parseFrontmatter(path);
    if (!title) continue;

    const key = title.toLowerCase();
    if (seen.has(key)) clashes.push({ title, a: seen.get(key), b: path });
    else seen.set(key, path);
  }
}

if (clashes.length > 0) {
  console.error('\nDuplicate article titles found.');
  console.error('Comment threads are keyed on the title, so these would share one thread:\n');
  for (const { title, a, b } of clashes) {
    console.error(`  "${title}"`);
    console.error(`     ${a}`);
    console.error(`     ${b}\n`);
  }
  process.exit(1);
}

console.log(`check-titles: ${seen.size} titles, all unique`);
