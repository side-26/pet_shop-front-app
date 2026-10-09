---
name: dynamic-dialog-architecture
description: Build or refactor lazy, imperative React 19 dialogs in Next.js using typed refs, stable context, safe exit animations, and optional Suspense/TanStack Query error recovery. Use for substantial interactive dialogs, not simple alerts.
---

# Dynamic Dialog Architecture

## Summary

Use for create/edit/detail/selection dialogs or drawers that need imperative opening, optional params, deferred JS, and possibly async content. Avoid for simple confirmation/alert dialogs, static popovers, or UI that is better expressed as a route. Preserve existing UX, accessibility, API conventions, and business behavior. **Do not force every layer onto every dialog.**

## Concepts

- **Controller:** parent holds `DialogHandle<TParams>` refs; opens/closes named dialogs through existing `useDialogController` where available.
- **Wrapper:** tiny client component owns `unmounted → open → closing → unmounted`; keeps the dialog mounted through exit, lazy-imports its main component at module scope, exposes `open/close` via `useImperativeHandle`.
- **Context:** one module-scope React 19 context per dialog; wrapper supplies parameters using `<Context value={params}>`; descendants consume via `use(Context)`/typed hook. Never create context during render.
- **Main dialog:** controlled shadcn/Radix Dialog and title/description; coordinates exit completion; doesn't fetch data.
- **Optional async layer:** `QueryErrorResetBoundary → error boundary → Suspense → ContentRenderer`; renderer fetches and chooses empty/success; `Content` handles real data and skeleton.

## Workflow

1. Inspect the target dialog, its callers, DTO/entity types, existing controller/context, query hooks, UI primitives, error boundary API, and animations. Follow project conventions; do not invent dependencies.
2. Classify it: simple confirm, create/edit form, read-only async, selection, or multi-step. Keep the smallest structure that preserves its behavior. Reuse existing components.
3. Resolve **per-dialog parameters** from an existing DTO first, `Pick`/`Omit` when appropriate, or define a local type; use `void` for no params. Make `DialogHandle<TParams>`, wrapper, controller and context agree. Generate **distinct typed wrappers** for different dialogs; never alias a parameterized wrapper for a parameterless dialog.
4. Implement the wrapper lifecycle and lazy `next/dynamic(() => import('./dialog'))` at module scope. Preserve params while closing; handle rapid reopen and stale exit callbacks. No ref mutation during render.
5. Create context once at module scope; share one exported `DialogParams` type between context and wrapper. React 19 direct provider syntax is preferred.
6. Main dialog handles accessibility, controlled open state, and verified exit completion. Do not depend solely on `onAnimationEnd`: handle no animation, cancellation, reduced motion, and a bounded timeout. Observe only relevant exit animations; ensure old completion cannot unmount a newly reopened dialog. Test with the project's actual shadcn/Radix implementation.
7. **Only if data is fetched:** use the project's client-safe API/query layer with TanStack `useSuspenseQuery`, stable keys including params, and `QueryErrorResetBoundary` plus a resettable React error boundary. Retry must reset **both** Query and React error boundary. Verify the actual `next/error` `catchError`/`ErrorInfo` API if that abstraction is used; do not assume a `reset` property exists. Use `Suspense` skeleton and a meaningful empty state. Never use `'use cache'`/`cacheLife` inside client components or call server-only fetchers from the browser.
8. Keep presentation typed with real DTOs, not `any`. Adapt title, skeleton, error and empty states to the dialog's job. Preserve form/mutation success, focus restoration, Escape, outside-click policy and close behavior.
9. Validate TypeScript/lint and test open, close, rapid reopen, changing params, reduced motion, exit completion, loading, error/retry, empty, success and keyboard accessibility. Report what was verified and any missing project-specific APIs.

## Guardrails

- Prefer existing project utilities over creating a new framework.
- Avoid unnecessary global state, prop drilling, full-page reload on retry, and duplicated controllers.
- Do not treat illustrative examples as literal production code; infer DTOs, query functions and UI from the repository.
- For async dialog data, preserve distinct responsibilities: `DialogMainContent` orchestrates boundaries; `ContentRenderer` loads/branches; `Content` presents.

For implementation patterns and checks, read [references/blueprint.md](references/blueprint.md) only when needed.
