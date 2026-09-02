---
name: table-text-clamping
description: Clamp text content in table columns in this Pet Shop frontend. Use when adding or changing text cells in data tables.
---

# Table Text Clamping

For text displayed in a data-table cell, cap the visible content at two lines by default.

- Keep `TableCell` as the native table cell; do not apply `line-clamp` directly to it because its table display prevents the clamp from taking effect.
- Put the text in a block-level child and apply `tw:line-clamp-2` to that child. Keep `tw:whitespace-normal` on the cell when wrapping is needed.
- Preserve any deliberate exceptions, such as identifiers, numeric values, controls, or columns explicitly designed for more content.
- Add or update a focused test that asserts the text wrapper has the two-line clamp class.

## Headers

Wrap every visible `TableHead` label in a `<div>`. Put any label-specific classes on that inner
`<div>` so the native table-header element continues to own table layout and header semantics.

```tsx
<TableHead>
  <div className="tw:text-label-s">عنوان</div>
</TableHead>
```

```tsx
<TableCell className="tw:max-w-64 tw:whitespace-normal">
  <div className="tw:line-clamp-2">{row.summary}</div>
</TableCell>
```
