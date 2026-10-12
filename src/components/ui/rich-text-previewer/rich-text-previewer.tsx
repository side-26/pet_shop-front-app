import type { ReactNode } from 'react';

import type { RichTextDocument } from '@/lib/rich-text';
import { cn } from '@/lib/utils';

import { RichTextPreviewerComposer } from './rich-text-previewer-composer';
import { defaultRichTextPreviewerExtensions } from './rich-text-previewer.extensions';
import type { RichTextPreviewerExtensions } from './rich-text-previewer.types';

type RichTextPreviewerProps = Readonly<{
  children: ReactNode;
  className?: string;
  dir?: 'auto' | 'rtl' | 'ltr';
}>;

type RichTextPreviewerContentProps = Readonly<{
  content: RichTextDocument;
  extensions?: RichTextPreviewerExtensions;
}>;

function RichTextPreviewerRoot({ children, className, dir = 'auto' }: RichTextPreviewerProps) {
  return (
    <div
      data-slot="rich-text-previewer"
      dir={dir}
      className={cn('tw:w-full tw:text-foreground', className)}
    >
      {children}
    </div>
  );
}

function RichTextPreviewerContent({ content, extensions = {} }: RichTextPreviewerContentProps) {
  return (
    <RichTextPreviewerComposer
      extensions={{
        marks: [...defaultRichTextPreviewerExtensions.marks, ...(extensions.marks ?? [])],
        nodes: [...defaultRichTextPreviewerExtensions.nodes, ...(extensions.nodes ?? [])],
      }}
      nodes={content.content}
    />
  );
}

const RichTextPreviewer = Object.assign(RichTextPreviewerRoot, {
  Content: RichTextPreviewerContent,
});

export {
  RichTextPreviewer,
  type RichTextPreviewerContentProps,
  type RichTextPreviewerExtensions,
  type RichTextPreviewerProps,
};
