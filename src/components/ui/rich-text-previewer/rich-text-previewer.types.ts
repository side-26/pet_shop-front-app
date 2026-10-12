import type { ComponentType, ReactNode } from 'react';

import type { RichTextNode } from '@/lib/rich-text';

export type RichTextPreviewerNodeProps = Readonly<{
  children: ReactNode;
  fallbackImageAlt?: string;
  node: RichTextNode;
  renderMarks: (content: ReactNode, marks: unknown) => ReactNode;
}>;

export type RichTextPreviewerMarkProps = Readonly<{
  children: ReactNode;
  mark: Readonly<{ attrs?: Record<string, unknown>; type: string }>;
}>;

export type RichTextPreviewerNodeExtension = Readonly<{
  Component: ComponentType<RichTextPreviewerNodeProps>;
  type: string;
}>;

export type RichTextPreviewerMarkExtension = Readonly<{
  Component: ComponentType<RichTextPreviewerMarkProps>;
  type: string;
}>;

export type RichTextPreviewerExtensions = Readonly<{
  marks?: readonly RichTextPreviewerMarkExtension[];
  nodes?: readonly RichTextPreviewerNodeExtension[];
}>;
