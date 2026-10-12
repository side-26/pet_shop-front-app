import Image from 'next/image';
import { createElement, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import type {
  RichTextPreviewerExtensions,
  RichTextPreviewerMarkProps,
  RichTextPreviewerNodeProps,
} from './rich-text-previewer.types';

const typographyByHeadingLevel = {
  1: 'tw:text-heading-3 md:tw:text-heading-2 lg:tw:text-heading-1',
  2: 'tw:text-title-l md:tw:text-heading-3 lg:tw:text-heading-2',
  3: 'tw:text-title-m md:tw:text-title-l lg:tw:text-heading-3',
  4: 'tw:text-title-s md:tw:text-title-m lg:tw:text-title-l',
  5: 'tw:text-label-l md:tw:text-title-s lg:tw:text-title-m',
  6: 'tw:text-label-m md:tw:text-label-l lg:tw:text-title-s',
} as const;

const headingTags = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

function normalizedHeadingLevel(value: unknown): keyof typeof headingTags {
  return typeof value === 'number' && value in headingTags
    ? (value as keyof typeof headingTags)
    : 1;
}

function direction(value: unknown): 'auto' | 'rtl' | 'ltr' | undefined {
  return value === 'auto' || value === 'rtl' || value === 'ltr' ? value : undefined;
}

function textAlign(value: unknown): CSSProperties['textAlign'] | undefined {
  return value === 'left' || value === 'center' || value === 'right' ? value : undefined;
}

function textStyle(node: RichTextPreviewerNodeProps['node']) {
  const alignment = textAlign(node.attrs?.textAlign);
  return alignment ? { textAlign: alignment } : undefined;
}

function TextNode({ node, renderMarks }: RichTextPreviewerNodeProps) {
  return <>{renderMarks(node.text ?? '', (node as { marks?: unknown }).marks)}</>;
}

function HardBreakNode() {
  return <br />;
}

function HeadingNode({ children, node }: RichTextPreviewerNodeProps) {
  const level = normalizedHeadingLevel(node.attrs?.level);
  const Tag = headingTags[level];

  return createElement(
    Tag,
    {
      className: cn(
        'tw:mt-8 tw:mb-3 tw:font-bold tw:text-foreground first:tw:mt-0',
        typographyByHeadingLevel[level],
      ),
      dir: direction(node.attrs?.dir),
      style: textStyle(node),
    },
    children,
  );
}

function ParagraphNode({ children, node }: RichTextPreviewerNodeProps) {
  return (
    <p
      className="tw:my-4 tw:text-body-s tw:text-foreground first:tw:mt-0 last:tw:mb-0 md:tw:text-body-m lg:tw:text-body-l"
      dir={direction(node.attrs?.dir)}
      style={textStyle(node)}
    >
      {children}
    </p>
  );
}

function BulletListNode({ children }: RichTextPreviewerNodeProps) {
  return <ul className="tw:my-4 tw:list-disc tw:space-y-2 tw:ps-6">{children}</ul>;
}

function OrderedListNode({ children }: RichTextPreviewerNodeProps) {
  return <ol className="tw:my-4 tw:list-decimal tw:space-y-2 tw:ps-6">{children}</ol>;
}

function ListItemNode({ children }: RichTextPreviewerNodeProps) {
  return <li>{children}</li>;
}

function BlockquoteNode({ children }: RichTextPreviewerNodeProps) {
  return (
    <blockquote className="tw:my-6 tw:border-s-4 tw:border-primary/40 tw:ps-4 tw:text-muted-foreground">
      {children}
    </blockquote>
  );
}

function ImageNode({ node }: RichTextPreviewerNodeProps) {
  const src = typeof node.attrs?.src === 'string' ? node.attrs.src : undefined;
  const isSupportedSource = src?.startsWith('/') || /^https:\/\//.test(src ?? '');
  if (!isSupportedSource || !src) return null;

  const caption = typeof node.attrs?.caption === 'string' ? node.attrs.caption : undefined;
  const alt =
    typeof node.attrs?.alt === 'string' && node.attrs.alt.trim()
      ? node.attrs.alt
      : caption || 'تصویر مرتبط با متن';

  return (
    <figure className="tw:my-6">
      <div className="tw:relative tw:aspect-video tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 896px, (min-width: 768px) 640px, 100vw"
          className="tw:object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="tw:mt-2 tw:text-caption tw:text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BoldMark({ children }: RichTextPreviewerMarkProps) {
  return <strong>{children}</strong>;
}

function ItalicMark({ children }: RichTextPreviewerMarkProps) {
  return <em>{children}</em>;
}

function StrikeMark({ children }: RichTextPreviewerMarkProps) {
  return <s>{children}</s>;
}

function CodeMark({ children }: RichTextPreviewerMarkProps) {
  return <code>{children}</code>;
}

function LinkMark({ children, mark }: RichTextPreviewerMarkProps) {
  const href = mark.attrs?.href;
  if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return <>{children}</>;

  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
}

export const defaultRichTextPreviewerExtensions: Required<RichTextPreviewerExtensions> = {
  marks: [
    { type: 'bold', Component: BoldMark },
    { type: 'italic', Component: ItalicMark },
    { type: 'strike', Component: StrikeMark },
    { type: 'code', Component: CodeMark },
    { type: 'link', Component: LinkMark },
  ],
  nodes: [
    { type: 'text', Component: TextNode },
    { type: 'hardBreak', Component: HardBreakNode },
    { type: 'heading', Component: HeadingNode },
    { type: 'paragraph', Component: ParagraphNode },
    { type: 'bulletList', Component: BulletListNode },
    { type: 'orderedList', Component: OrderedListNode },
    { type: 'listItem', Component: ListItemNode },
    { type: 'blockquote', Component: BlockquoteNode },
    { type: 'image', Component: ImageNode },
  ],
};
