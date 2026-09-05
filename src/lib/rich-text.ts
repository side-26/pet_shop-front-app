/** A persisted Tiptap-compatible JSON document; HTML strings are intentionally excluded. */
export type RichTextDocument = {
  type: 'doc';
  content?: RichTextNode[];
  [key: string]: unknown;
};

export type RichTextNode = {
  type: string;
  content?: RichTextNode[];
  attrs?: Record<string, unknown>;
  text?: string;
  [key: string]: unknown;
};

/** Temporary form compatibility while editor call sites migrate from text values. */
export type RichTextFormValue = RichTextDocument | string;

export function isRichTextDocument(value: unknown): value is RichTextDocument {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).type === 'doc'
  );
}

export function isOptionalRichTextDocument(value: unknown): boolean {
  return value === undefined || isRichTextDocument(value);
}

export function richTextToPlainText(value: RichTextFormValue): string {
  if (typeof value === 'string') return value;
  const text: string[] = [];
  const visit = (node: RichTextNode) => {
    if (node.text) text.push(node.text);
    node.content?.forEach(visit);
  };
  visit(value);
  return text.join(' ');
}

/** Returns the persisted image URLs embedded in a Tiptap document. */
export function getRichTextImageUrls(value: unknown): string[] {
  if (!isRichTextDocument(value)) return [];

  const urls = new Set<string>();
  const visit = (node: RichTextNode) => {
    const source = node.type === 'image' ? node.attrs?.src : undefined;
    if (typeof source === 'string' && /^https?:\/\//.test(source)) urls.add(source);
    node.content?.forEach(visit);
  };

  visit(value);
  return [...urls];
}
