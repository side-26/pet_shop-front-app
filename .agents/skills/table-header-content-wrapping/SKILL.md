---
name: table-header-content-wrapping
description: Wrap table-header content in a div and place header text styling on that div when creating or editing table headers.
---

# Table Header Content Wrapping

For each `th`/`TableHead`, put its visual content inside a child `div`.

- Move text-presentation classes from the header to that `div`, including text
  size, weight, color, alignment, whitespace, truncation, and line clamping.
- Keep table-cell and column-layout concerns on `th`/`TableHead`, such as width,
  sizing, padding, sticky positioning, and structural accessibility attributes.
- Preserve semantic header behavior: `scope`, `aria-*`, sort controls, and event
  handlers remain attached to the appropriate header or interactive child.
- Wrap icon-only and screen-reader-only labels too; keep their existing
  accessibility classes on the inner content.
- Do not introduce a wrapper around a component that already renders the header
  content as a dedicated child element, unless the table's local pattern needs
  one.

Example:

```tsx
<TableHead className="tw:w-40">
  <div className="tw:text-right tw:font-semibold tw:text-foreground">عنوان</div>
</TableHead>
```
