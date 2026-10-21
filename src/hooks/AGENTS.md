# Reusable Hooks

`hooks/` contains reusable client-side behavior that is independent of a single route or entity.

## Contents

- Dialog, debounce, mutation-option, responsive viewport, unsaved-change prevention, default-value, client-action adaptation, browser-share, and top-loader-backed router hooks.
- `use-report-client-error.ts` connects client boundaries to sanitized observability reporting.

## Rules

- Hooks that use browser APIs, effects, subscriptions, timers, or event listeners must clean them up deterministically.
- Keep hooks focused on behavior; keep UI rendering in components and API transport in entities/lib.
- Add integration tests for observable hook behavior, including cleanup and browser-state changes where applicable.

- `use-router.ts` is the sole client-side programmatic-navigation entry point and delegates to `nextjs-toploader/app`.
- `use-share.ts` owns the browser share-sheet and clipboard fallback contract for current-page sharing.
- `use-mutation-options.ts` standardizes TanStack mutations backed by Server Actions that return the project's `FetcherResult` union. It throws unsuccessful results so `onError` handles them, and defaults retry, error reporting, and success toasts.

## Maintenance

Update this guide when a hook is added, removed, renamed, or its shared lifecycle contract changes.
