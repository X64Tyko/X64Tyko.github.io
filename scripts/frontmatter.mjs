import { readFileSync } from 'node:fs';

/**
 * Read a file and normalise its line endings.
 *
 * This matters more than it looks. In JavaScript a carriage return is a line
 * terminator, so `.` will not match one and `$` without the `m` flag will not
 * match before one. A CRLF file therefore parses as *nothing* under regexes
 * written for LF, silently and with no error. Normalise once, here, so no
 * caller has to remember.
 */
export function readNormalised(path) {
  return readFileSync(path, 'utf8').replace(/\r\n?/g, '\n');
}

/** The frontmatter block, or '' if the file has none. */
export function frontmatterBlock(path) {
  return readNormalised(path).split(/^---$/m)[1] ?? '';
}

/** Strip one layer of matching quotes. */
function unquote(value) {
  return value.replace(/^(['"])(.*)\1$/, '$2');
}

/**
 * Parse frontmatter well enough for our schema: scalar values and inline
 * `[a, b]` arrays. Block scalars (`description: >-`) yield their key with an
 * empty value, which is fine because nothing here needs the body text.
 */
export function parseFrontmatter(path) {
  const out = {};

  for (const line of frontmatterBlock(path).split('\n')) {
    const match = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!match) continue;

    const [, key] = match;
    let value = unquote(match[2].trim());

    if (value.startsWith('[')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => unquote(v.trim()))
        .filter(Boolean);
    }

    out[key] = value;
  }

  return out;
}
