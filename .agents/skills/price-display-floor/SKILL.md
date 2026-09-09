---
name: price-display-floor
description: Display monetary amounts as whole numbers in this Pet Shop frontend by flooring decimals through the shared Price component.
---

# Price Display Flooring

Use `Price` from `src/components/ui/price.tsx` for read-only monetary values.

- `Price` floors the supplied number before formatting, so callers must pass the actual monetary amount rather than pre-rounding it.
- Keep input, form, API, and persisted numeric values unchanged; flooring is a display-only policy.
- Do not format monetary values with `toLocaleString()` or manually append `APP_CURRENCY` when `Price` can be used.
- Preserve LTR isolation and the shared application currency label supplied by `Price`.
- Update the Price test and `/ui-components` showcase when changing this display contract.
