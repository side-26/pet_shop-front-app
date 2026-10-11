---
name: client-suspense-query-fetch-flow
description: Create or review browser data flows that use internal Next.js Route Handlers, TanStack Query Suspense hooks, and a server-only backend fetcher. Use for this explicit client-to-internal-API path, not ordinary Server Action flows.
---

# Client Suspense Query Fetch Flow

Use this skill for a client-side query or mutation that must reach an external backend through a same-origin Next.js Route Handler:

```text
Client UI -> entity.client.ts -> entity.service.ts -> internalFetcher
  -> app/api Route Handler -> server-only customFetcher -> backend
```

It is deliberately separate from the repository's Server Action path. Before changing an entity, inspect
its existing layers and callers. If the component is meant to call a Server Action, follow the established
entity/action workflow instead; do not introduce an internal API route merely to use TanStack Query.

Read [the internal API boundary reference](references/internal-api-boundary.md) before changing the
transport, Route Handler, error contract, authentication behavior, or tests for this flow.

## Inspect before implementation

Read the affected entity's `*.client.ts`, `*.service.ts`, and `*.dto.ts`, the Route Handler, the existing
`internalFetcher`, server-only `customFetcher`, API-handler wrapper, response/error types, transformer
utility, and nearby Suspense/Error Boundary tests. Use their real paths, exports, and contracts; examples
in this skill do not authorize moving modules or replacing shared infrastructure.

Confirm which layer already owns the operation and whether its response is a raw value, a success/error
envelope, or an exception before designing the query function.

## Layer ownership

- **Route Handler:** is the server-side security and transport boundary. It uses the existing API-handler
  wrapper and server-only backend fetcher; it never exposes sessions, access/refresh tokens, backend URLs,
  stack traces, or unfiltered backend errors.
- **`{entity}.service.ts`:** calls only `internalFetcher` for this flow and returns plain, accurately typed
  JSON-shaped data. Accept and pass an optional `AbortSignal`; keep React, TanStack Query, and DTO
  transformation out of the service.
- **`{entity}.client.ts`:** is the one entity-owned home for query-key factories, `useSuspenseQuery`,
  `useMutation`, selectors, and targeted query invalidation. Keep selectors stable and outside hooks when
  practical.
- **`{entity}.dto.ts`:** owns wire types and any distinct client projection types. Do not type JSON as a
  class instance or `Date` when it remains a plain object or ISO string at runtime.
- **UI:** consumes the entity hook under appropriate Suspense and error boundaries. A dialog or drawer gets
  its own narrow boundaries so a local request cannot block the page.

Do not add a separate query-key file, a generic Suspense-query wrapper, a duplicate fetcher/API wrapper,
or a second transformer layer.

## Query and transformation rules

- Every result-changing input—identity, filters, sort, pagination, and search—belongs in the query key.
  Pass TanStack Query's `signal` through the service to `internalFetcher`.
- Choose stale time, retry, refetch, and invalidation from existing entity conventions. Invalidate the
  smallest complete key scope after a successful mutation; do not retry predictable client errors blindly.
- Use the existing `src/app/core/transformer/transform.ts` only from a synchronous, pure `select` callback
  when a consumer needs a projected DTO. Inspect its actual signature first. Do not transform the same data
  again in the service or imply that client-side projection removes fields from the network response.
- Remember that `select` changes an observer's result, not the underlying query cache. Avoid expensive
  class transformation for large lists unless it is justified and measured.

## Suspense and completion

`useSuspenseQuery` must be inside a suitable Suspense boundary and error boundary. Reuse the repository's
loading skeletons and error-reset conventions. Do not navigate, update state, or initiate network work
during render; keep those effects in handlers or effects.

Add focused tests for the changed boundary, then run the relevant typecheck, lint, focused tests, and
production build. Verify authenticated calls remain server-only, status/error behavior is preserved,
cancellation reaches the fetcher, keys vary with inputs, mutations invalidate narrowly, and loading/error
recovery works in the affected UI.
