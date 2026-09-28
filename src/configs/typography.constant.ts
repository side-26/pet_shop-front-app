// AUTO-GENERATED FILE.
// DO NOT EDIT MANUALLY.
// Source: ./src/app/styles/tailwind.config.css

export const typography = {
  'display-xl': 'tw:text-display-xl',
  'display-l': 'tw:text-display-l',
  'heading-1': 'tw:text-heading-1',
  'heading-2': 'tw:text-heading-2',
  'heading-3': 'tw:text-heading-3',
  'title-l': 'tw:text-title-l',
  'title-m': 'tw:text-title-m',
  'title-s': 'tw:text-title-s',
  'body-l': 'tw:text-body-l',
  'body-m': 'tw:text-body-m',
  'body-s': 'tw:text-body-s',
  'label-l': 'tw:text-label-l',
  'label-m': 'tw:text-label-m',
  'label-s': 'tw:text-label-s',
  caption: 'tw:text-caption',
  'price-l': 'tw:text-price-l',
  'price-m': 'tw:text-price-m',
  'price-s': 'tw:text-price-s',
} as const;

export type Typography = keyof typeof typography;

export const typographyGroups = {
  display: ['display-xl', 'display-l'],

  heading: ['heading-1', 'heading-2', 'heading-3'],

  title: ['title-l', 'title-m', 'title-s'],

  body: ['body-l', 'body-m', 'body-s'],

  label: ['label-l', 'label-m', 'label-s'],

  caption: ['caption'],

  price: ['price-l', 'price-m', 'price-s'],
} as const satisfies Record<string, readonly Typography[]>;

export type TypographyGroup = keyof typeof typographyGroups;

export const typographyFallbackGroups = {
  display: ['display', 'heading', 'title', 'body', 'label', 'caption'],

  heading: ['heading', 'title', 'body', 'label', 'caption'],

  title: ['title', 'body', 'label', 'caption'],

  body: ['body', 'label', 'caption'],

  label: ['label', 'caption'],

  caption: ['caption'],

  price: ['price'],
} as const satisfies Record<TypographyGroup, readonly TypographyGroup[]>;
