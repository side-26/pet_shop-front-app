---
name: dynamic-dialog-controller
description: Use when creating, refactoring, or wiring multiple imperative React 19 / Next.js dialogs through the project's useDialogController hook. Preserve type-safe refs and per-dialog open parameters, reuse existing wrappers, and avoid unnecessary global dialog state.
---

# Dynamic Dialog Controller

## Summary
Coordinate page-scoped dialogs using `useDialogController`, typed `DialogHandle` refs, and existing lazy dialog wrappers. Keep orchestration in the parent and dialog internals inside each wrapper.

**Use for:** pages with multiple dialogs; buttons, menus, or table actions opening dialogs; migrating ad-hoc `isOpen` booleans or duplicated ref calls to a typed controller.

**Do not use for:** a single trivial dialog with no orchestration benefit; global cross-route modal systems; non-dialog navigation; cases where ordinary controlled `open` state is simpler.

## Concepts
- **Controller:** maps stable dialog keys to refs and exposes typed imperative operations.
- **Handle:** each wrapper implements the project's `DialogHandle<TParams>` contract (`open`/`close`).
- **Parameters:** each dialog has its own contract, inferred from existing DTOs when suitable; `void` for no input.
- **Ownership:** parent decides *which* dialog opens; wrapper owns mount/close/exit animation; content owns fetching/forms.

## Project hook location
The existing controller is at **`/src/hook/use-dialog-contoller.ts`** (preserve this exact spelling). Inspect and import it from this path; do not create a duplicate controller or silently rename the file.

## Agent workflow
1. Open `/src/hook/use-dialog-contoller.ts` and inspect the existing `useDialogController`, `DialogHandle`, and all target wrappers before editing. Respect their actual APIs and types; do not assume the sample signature if the project differs.
2. Identify each dialog key, triggering action, and required parameters. Prefer an existing entity DTO or a narrow `Pick`/derived type; otherwise define a dialog-specific type. Never default every dialog to `{ id: number }`.
3. Create one typed `useRef<DialogHandle<Params>>(null)` per dialog; use the project's parameterless convention for dialogs without arguments.
4. Register stable keys in `useDialogController` and call `dialogs.open(key, params)` or `dialogs.open(key)` as appropriate. Use `dialogs.close(key)` only if the existing controller exposes it.
5. Render the **corresponding** wrapper for each ref. Never point two differently typed refs at the same parameter-specific wrapper.
6. Keep `next/dynamic` at module scope inside wrappers, and preserve the wrapper's `unmounted → open → closing → unmounted` lifecycle where applicable. Do not move data fetching or animation state into the controller.
7. Validate TypeScript, lint, keyboard close, rapid open/close, reopening during exit, and opening a second dialog while one is active. If the product requires only one dialog open, verify the controller actually enforces it; do not assume.

## Constraints
- Prefer the existing controller implementation; modify it only to correct a demonstrated API/type bug.
- Keep dialog keys type-safe. Invalid keys, missing required params, and extra params should fail at compile time where possible.
- Do not create a Zustand/Redux/global event bus just to coordinate page-local dialogs.
- Avoid recreating ref registries or dialog contexts on every render unnecessarily.
- Do not add Suspense, queries, empty states, or mutation layers to simple dialogs unless needed.
- If no `useDialogController` implementation is available, ask for it or clearly mark any proposed hook as an unverified example.

See [references/usage.md](references/usage.md) for the illustrative usage and verification checklist.
