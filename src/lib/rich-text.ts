/** A persisted Tiptap-compatible JSON document; HTML strings are intentionally excluded. */
export type RichTextDocument = {
  type: 'doc';
  content?: RichTextNode[];
  [key: string]: unknown;
};

export type RichTextNode = {
  type: string;
  content?: RichTextNode[];
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
