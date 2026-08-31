---
name: yup-tree-shaking
description: Create, refactor, or review Yup schemas and Yup-consuming TypeScript files using tree-shakeable named imports instead of namespace or default imports. Use whenever adding or changing Yup validation, inferred Yup types, schema tests, or form examples in this repository.
---

# Yup Tree-Shaking

Keep Yup imports explicit so bundles include only the runtime constructors and helpers each module uses.

## Import contract

- Import runtime APIs directly from `yup`, such as `object`, `string`, `number`, `boolean`, `array`, `mixed`, or `ref`.
- Import Yup types with inline `type` modifiers or a separate `import type`, such as `type InferType`, `type ObjectSchema`, or `type AnyObjectSchema`.
- Never use `import * as yup from 'yup'`, a Yup default import, or `yup.*` member access.
- Keep already-correct named imports such as `ValidationError` unchanged.
- Import only symbols used by the file. Do not add a shared Yup facade or re-export layer.
- Load `@/configs/yup.config` in every Yup-consuming module so common validation messages use the shared Persian locale and field-label dictionary. Import `yupMessage` only for domain-specific rules that cannot use a Yup default message.
- Do not write common required, type, length, range, format, or allowed-value messages inline. Add missing field labels or reusable domain messages to `yup.config.ts`.

Example:

```ts
import { boolean, object, string, type InferType } from 'yup';

export const productSchema = object({
  title: string().trim().required(),
  enabled: boolean().default(true),
});

export type ProductInput = InferType<typeof productSchema>;
```

## Refactoring workflow

1. Audit the requested scope for Yup imports and `yup.*` access.
2. Replace namespace/default access with the smallest set of named runtime and type imports.
3. Preserve schema chaining, defaults, transforms, inferred types, and exported APIs. Replace duplicated common messages with the shared locale while preserving intentional domain-specific wording through `yupMessage`.
4. Format the changed files.
5. Confirm the scope contains no namespace/default Yup imports or `yup.*` access.
6. Run TypeScript, focused schema/form tests, and lint.

Use `rg` for the audit:

```sh
rg -n "import \\* as yup|yup\\.|from ['\"]yup['\"]" src
```

Treat a change as incomplete if validation behavior or inferred request types drift during an import-only refactor.
