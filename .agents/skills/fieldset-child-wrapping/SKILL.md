---
name: fieldset-child-wrapping
description: Apply shared width and shrink-safe defaults to fieldsets in Pet Shop frontend forms.
---

# Fieldset Layout Defaults

Every `<fieldset>` in a form must include `tw:w-full tw:min-w-0` in its `className`.

- Keep any existing layout, spacing, responsive, or visual classes on the `<fieldset>`.
- A fieldset may include any additional classes, but it must retain both required defaults.
- Preserve native fieldset attributes, especially `disabled`.
- Do not add a structural wrapper solely for this rule; keep the form's existing child structure.

```tsx
<fieldset
  disabled={isLoading}
  className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-3"
>
  <legend>گزینه‌های ارسال</legend>
  <div>{deliveryDescription}</div>
  <RadioGroup>{options}</RadioGroup>
</fieldset>
```
