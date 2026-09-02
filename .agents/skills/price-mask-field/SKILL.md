---
name: price-mask-field
description: Use PriceMaskField for editable currency and monetary price inputs in this Pet Shop frontend.
---

# Price Mask Field

Use `PriceMaskField` from `@/components/ui/fields/price-mask-field` for every editable monetary amount. Do not use `TextField` or a raw numeric input for a price.

- Applies to pet, product, service, shipping, and other currency amounts.
- Do not apply it to percentages, quantities, counts, IDs, or other non-currency numeric values.
- Keep schemas and API contracts numeric. `PriceMaskField` gives React Hook Form an unformatted `number | null`; do not parse grouped strings at call sites.
- Preserve the existing field name, schema validation, disabled/skeleton behavior, labels, hints, colors, and sizes during a migration.
- Use the default `ریال` prefix and dollar-sign suffix unless the domain specifically requires different adornments.
- Update focused form tests when relevant to cover formatted display and raw numeric submission.
