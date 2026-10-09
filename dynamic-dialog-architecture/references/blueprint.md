# Implementation blueprint (adapt to repository)

## Typical structure (omit unused files)

```
feature-dialog/
  dialog-context.tsx       # module-scope context + shared params type
  wrapper.tsx              # typed imperative handle, lifecycle, lazy import
  dialog.tsx               # shadcn Dialog and exit handling
  dialog-main-content.tsx  # optional error/Suspense orchestration
  content-renderer.tsx     # optional client query and empty/success selection
  content.tsx              # UI + skeleton
  empty-state.tsx          # optional empty UI
```

## Lifecycle invariant

```ts
type DialogState<T> =
  { status: 'unmounted' } | { status: 'open'; params: T } | { status: 'closing'; params: T };
```

- `open(params)` transitions to `open`, even if previously closing.
- `close()` transitions `open` to `closing`, retaining params.
- Exit completion transitions `closing` to `unmounted` **only for the same close cycle**. Guard against stale events/promises/timeouts after reopening; clear fallback timers on cleanup.
- Handle `void` params with the existing `DialogHandle` contract; do not assume every dialog takes `{id:number}`.
- If CSS animations are absent, finish promptly. If animations exist, observe relevant exit animations and use a finite deadline. `element.getAnimations({subtree:false})` avoids unrelated descendant spinners, but does not alone guarantee completion.
- Check whether Radix/shadcn retains the content node during close. Avoid calling exit completion before the exit actually begins; test overlays and content.

## React 19 context

```tsx
'use client';
import { createDialogContext } from '@/contexts/dialogs/dialog-context';
import type { EntityDTO } from '@/entities/example/example.dto';

export type DialogParams = Pick<EntityDTO, 'id'>; // EXAMPLE ONLY
export const { Context: EntityDialogContext, useDialogParams: useEntityDialogParams } =
  createDialogContext<DialogParams>();
```

Wrapper: `<EntityDialogContext value={dialog.params}><MainDialog ... /></EntityDialogContext>`.

## Optional async boundaries

```tsx
<QueryErrorResetBoundary>
  {({ reset: resetQuery }) => (
    <ResettableErrorBoundary
      /* adapt to the actual boundary's supported API */
      onReset={resetQuery}
      fallbackRender={({ resetErrorBoundary }) => (
        <DialogFetchErrorSection onRetry={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<Content isSkeleton />}>
        <ContentRenderer />
      </Suspense>
    </ResettableErrorBoundary>
  )}
</QueryErrorResetBoundary>
```

`ResettableErrorBoundary` above is a **conceptual placeholder**, not an assumed project export. With `next/error` `catchError`, inspect its installed types and actual recovery contract before wiring. If unsupported, adapt or use an existing resettable boundary; do not silently pass query reset alone as retry.

## Migration checks

- Confirm all callers and ref signatures compile; create and update examples must not import the same incompatible wrapper.
- Query keys include changing dialog params; switching entities doesn't show stale errors.
- Error retry resets both layers and shows skeleton/refetch, not a full page reload.
- Closing with reduced motion/no animation still unmounts; rapid reopen never gets unmounted by stale completion.
- Focus trap/return, Escape, labels, descriptions, keyboard controls, form submission, mutation success and cancel remain correct.
- Run relevant typecheck, lint and tests; explain any unverified behavior.
