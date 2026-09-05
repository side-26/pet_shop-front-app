import { Extension, type Extensions } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@/lib/utils';

const tipTapTextAlignments = ['left', 'center', 'right'] as const;
const tipTapTextDirections = ['auto', 'rtl', 'ltr'] as const;

type TipTapTextAlignment = (typeof tipTapTextAlignments)[number];
type TipTapTextDirection = (typeof tipTapTextDirections)[number];

const TipTapTypographyScale = Extension.create({
  name: 'typographyScale',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          typographyScale: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-typography-scale'),
            renderHTML: (attributes) =>
              attributes.typographyScale
                ? { 'data-typography-scale': attributes.typographyScale }
                : {},
          },
        },
      },
    ];
  },
});

const tipTapTypographyClassName = cn(
  'tw:text-body-m',
  'tw:[&_h1]:text-heading-1',
  'tw:[&_h2]:text-heading-2',
  'tw:[&_h3]:text-heading-3',
  'tw:[&_[data-typography-scale=heading-4]]:text-title-l',
  'tw:[&_[data-typography-scale=heading-5]]:text-title-m',
  'tw:[&_p]:text-body-m',
  'tw:[&_[data-typography-scale=body-s]]:text-body-s',
  'tw:[&_ul]:list-disc tw:[&_ul]:ps-6',
  'tw:[&_ol]:list-decimal tw:[&_ol]:ps-6',
  'tw:[&_li]:my-1',
  'tw:[&_blockquote]:border-s-4 tw:[&_blockquote]:border-current/35 tw:[&_blockquote]:ps-4 tw:[&_blockquote]:italic',
);

function createTipTapExtensions(): Extensions {
  return [
    StarterKit,
    TipTapTypographyScale,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: [...tipTapTextAlignments],
    }),
    Typography,
    Image.configure({ allowBase64: true }),
  ];
}

export {
  createTipTapExtensions,
  TipTapTypographyScale,
  tipTapTextAlignments,
  tipTapTextDirections,
  tipTapTypographyClassName,
  type TipTapTextAlignment,
  type TipTapTextDirection,
};
