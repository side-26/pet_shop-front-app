---
name: client-layer-mutation
description: Build or refactor an entity client mutation layer in this Pet Shop frontend using TanStack Query, shared action-result options, form error wiring, and service-owned cache invalidation.
---

# Client-Layer Mutations

Use this skill when an entity's browser mutation flow calls Server Actions, especially when replacing `useTransition`, direct action calls, submit helpers, or mutation-driven `router.refresh()` calls.

## Inspect first

Read the entity's client, actions, service, callers, and tests. Confirm whether its reads are Server Component data, client TanStack queries, or both. Reuse `useMutationOptions` from `src/hooks/use-mutation-options.ts`; do not recreate its result handling in each entity.

## Ownership

```text
Component -> entity client hook -> Server Action -> service -> customFetcher
                               \-> useMutationOptions -> TanStack Query
```

- The service owns `EntityTag` registration and invalidates tags only after a successful backend result. Inspect its tests to confirm create, update, and delete invalidate every affected list/detail/dependent tag, while failed results invalidate nothing.
- The client invalidates only entity-owned TanStack query keys, and only from mutation `onSuccess`. Await invalidation when the next local UI state depends on fresh query data. Do not invalidate client cache for server-rendered-only reads.
- `useMutationOptions(action, options)` owns the common action-result contract: unsuccessful `FetcherResult`s throw, `retry` defaults to `false`, `globalErrorHandler` is the default error handler, and backend messages always become success toasts. Entity `onSuccess` adds post-success work; it does not replace the toast.
- Components consume entity hooks; they do not call a Server Action, toast, normalize errors, or call `router.refresh()` after a successful tagged mutation.

## Entity pattern

Give the entity a thin private mutation factory and a typed options alias:

```ts
type EntityMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

function useEntityMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: EntityMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}
```

Expose focused hooks such as `useCreateEntityMutation`, `useUpdateEntityMutation`, and `useDeleteEntityMutation`. Keep a form wrapper responsible only for its `FormHandle`, mapping form input to mutation variables, and the local post-success effect such as closing a dialog.

Use callback-based `mutate`, not `mutateAsync`, when the caller needs no result value:

```ts
if (isPending) return;
mutate(variables, { onSuccess });
```

This avoids empty `try/catch` blocks. Keep `throw result` inside `useMutationOptions`; without it, a failed `FetcherResult` would incorrectly invoke `onSuccess`.

For repeated create/update/delete wrappers, a small entity-local helper may centralize only the pending guard and `mutate(variables, { onSuccess })` call. Do not promote entity input mapping, dialog behavior, or cache decisions into that helper.

## Form errors and special preparation

Pass a form-specific `onError` option that delegates the complete error once; this is the only path that maps backend field errors onto the form:

```ts
onError: (error) =>
  globalErrorHandler(error, formRef.current ? { showErrorFields: formRef.current.setError } : undefined)
```

If a form has preparatory work (for example rich-text image upload), keep that work in the entity client. Its upload failure handling must remain distinct from mutation `onError` so the same error is not reported twice.

For status, delete, and other non-form mutations, use the default `globalErrorHandler`; it presents the normalized single backend message without attempting field mapping.

## Cleanup and verification

Remove obsolete submit helpers, direct action imports in components, redundant success toasts, `useTransition` mutation orchestration, and mutation-driven `router.refresh()` calls. Keep explicit manual reload controls.

Update client tests to render hooks with `QueryClientProvider`. Test successful action delegation, a failed result reaching the error handler once with no retry, and any client-query invalidation. Run focused tests, lint, and `git diff --check`.
