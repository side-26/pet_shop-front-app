import fs from 'node:fs';
import path from 'node:path';

const INPUT = './src/app/styles/tailwind.config.css';
const OUTPUT = './src/configs/typography.constant.ts';

/**
 * Groups that should not participate in the normal
 * typography fallback chain.
 *
 * Example:
 * price-l should never be a fallback for caption.
 */
const ISOLATED_GROUPS = new Set(['price']);

const css = fs.readFileSync(INPUT, 'utf8');

/**
 * Match only base typography variables:
 *
 * --text-heading-1: 2.25rem;
 *
 * Ignore:
 *
 * --text-heading-1--line-height
 * --text-heading-1--font-weight
 */
const regex = /--text-([a-z0-9-]+)\s*:\s*([^;]+);/g;

const tokens = [];

for (const match of css.matchAll(regex)) {
  const token = match[1];

  if (token.includes('--')) continue;

  tokens.push(token);
}

const uniqueTokens = [...new Set(tokens)];

function getGroup(token) {
  return token.split('-')[0];
}

/**
 * Create groups while preserving CSS declaration order.
 */
const groups = uniqueTokens.reduce((result, token) => {
  const group = getGroup(token);

  result[group] ??= [];
  result[group].push(token);

  return result;
}, {});

const groupNames = Object.keys(groups);

/**
 * Groups participating in normal fallback behavior.
 */
const normalGroups = groupNames.filter((group) => !ISOLATED_GROUPS.has(group));

/**
 * Generate:
 *
 * display -> display, heading, title, body, label, caption
 * heading -> heading, title, body, label, caption
 * title   -> title, body, label, caption
 * ...
 *
 * Isolated groups:
 *
 * price -> price
 */
const fallbackGroups = {};

for (const group of groupNames) {
  if (ISOLATED_GROUPS.has(group)) {
    fallbackGroups[group] = [group];
    continue;
  }

  const index = normalGroups.indexOf(group);

  fallbackGroups[group] = normalGroups.slice(index);
}

/**
 * typography
 */
const typographyEntries = uniqueTokens
  .map((token) => `  "${token}": "tw:text-${token}",`)
  .join('\n');

/**
 * typographyGroups
 */
const groupEntries = Object.entries(groups)
  .map(([group, tokens]) => {
    const items = tokens.map((token) => `    "${token}",`).join('\n');

    return `  "${group}": [
${items}
  ],`;
  })
  .join('\n\n');

/**
 * typographyFallbackGroups
 */
const fallbackEntries = Object.entries(fallbackGroups)
  .map(([group, fallback]) => {
    const items = fallback.map((item) => `    "${item}",`).join('\n');

    return `  "${group}": [
${items}
  ],`;
  })
  .join('\n\n');

const output = `// AUTO-GENERATED FILE.
// DO NOT EDIT MANUALLY.
// Source: ${INPUT}

export const typography = {
${typographyEntries}
} as const;

export type Typography = keyof typeof typography;

export const typographyGroups = {
${groupEntries}
} as const satisfies Record<
  string,
  readonly Typography[]
>;

export type TypographyGroup =
  keyof typeof typographyGroups;

export const typographyFallbackGroups = {
${fallbackEntries}
} as const satisfies Record<
  TypographyGroup,
  readonly TypographyGroup[]
>;
`;

fs.mkdirSync(path.dirname(OUTPUT), {
  recursive: true,
});

fs.writeFileSync(OUTPUT, output, 'utf8');

console.log(
  `✓ Generated ${uniqueTokens.length} typography tokens across ${groupNames.length} groups → ${OUTPUT}`,
);
