import type { ReactNode } from 'react';

import type { RichTextNode } from '@/lib/rich-text';

import type {
  RichTextPreviewerExtensions,
  RichTextPreviewerMarkExtension,
  RichTextPreviewerMarkProps,
  RichTextPreviewerNodeExtension,
  RichTextPreviewerNodeProps,
} from './rich-text-previewer.types';

function UnknownNode({ children }: RichTextPreviewerNodeProps) {
  return <>{children}</>;
}

function UnknownMark({ children }: RichTextPreviewerMarkProps) {
  return <>{children}</>;
}

function createExtensionMap<TExtension extends { type: string }>(
  extensions: readonly TExtension[],
) {
  return new Map(extensions.map((extension) => [extension.type, extension]));
}

type RichTextPreviewerComposerProps = Readonly<{
  extensions: Required<RichTextPreviewerExtensions>;
  fallbackImageAlt?: string;
  nodes?: readonly RichTextNode[];
}>;

type RichTextPreviewerRegistry = Readonly<{
  marks: ReadonlyMap<string, RichTextPreviewerMarkExtension>;
  nodes: ReadonlyMap<string, RichTextPreviewerNodeExtension>;
}>;

function renderMarks(
  content: ReactNode,
  marks: unknown,
  registry: RichTextPreviewerRegistry,
): ReactNode {
  if (!Array.isArray(marks)) return content;

  return marks.reduce<ReactNode>((markedContent, mark) => {
    if (!mark || typeof mark !== 'object' || typeof mark.type !== 'string') return markedContent;

    const extension = registry.marks.get(mark.type);
    const Mark = extension?.Component ?? UnknownMark;
    return <Mark mark={mark as RichTextPreviewerMarkProps['mark']}>{markedContent}</Mark>;
  }, content);
}

function renderNodes(
  nodes: readonly RichTextNode[] | undefined,
  registry: RichTextPreviewerRegistry,
  fallbackImageAlt: string | undefined,
) {
  return nodes?.map((node, index) => {
    const extension = registry.nodes.get(node.type);
    const Node = extension?.Component ?? UnknownNode;

    return (
      <Node
        key={`${node.type}-${index}`}
        fallbackImageAlt={fallbackImageAlt}
        node={node}
        renderMarks={(content, marks) => renderMarks(content, marks, registry)}
      >
        {renderNodes(node.content, registry, fallbackImageAlt)}
      </Node>
    );
  });
}

export function RichTextPreviewerComposer({
  extensions,
  fallbackImageAlt,
  nodes,
}: RichTextPreviewerComposerProps) {
  const registry = {
    marks: createExtensionMap(extensions.marks),
    nodes: createExtensionMap(extensions.nodes),
  };

  return renderNodes(nodes, registry, fallbackImageAlt);
}
