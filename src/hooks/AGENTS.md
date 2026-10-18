# Reusable Hooks

`hooks/` contains reusable client-side behavior that is independent of a single route or entity.

## Contents

- Dialog, debounce, responsive viewport, unsaved-change prevention, default-value, and client-action adaptation hooks.
- `use-report-client-error.ts` connects client boundaries to sanitized observability reporting.

## Rules

- Hooks that use browser APIs, effects, subscriptions, timers, or event listeners must clean them up deterministically.
- Keep hooks focused on behavior; keep UI rendering in components and API transport in entities/lib.
- Add integration tests for observable hook behavior, including cleanup and browser-state changes where applicable.

## Maintenance

Update this guide when a hook is added, removed, renamed, or its shared lifecycle contract changes.
