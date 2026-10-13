---
name: server-initialized-infinite-catalog
description: Build or review a query-driven catalog whose first page streams from a Server Action and whose later pages load through a TanStack Query Suspense infinite query. Use for this two-stage public list pattern, not ordinary paginated lists or client-only fetching.
---

# Server-Initialized Infinite Catalog

Use this pattern when a shareable URL-driven catalog needs server-rendered first-page content and client-side infinite continuation.

## Required data flow

```text
Page searchParams
  -> Server section starts validated Server Action (without awaiting)
  -> async content uses the first-page Promise
  -> renderer receives resolved data and query
  -> client infinite-query hook seeds that first page
  -> client service -> same-origin Route Handler -> backend service
```

Keep the first-page Server Action and client continuation separate. The action validates untrusted input and calls the server-only entity service. The client must never import that service or call the Server Action to load later pages.

## Server composition

- Let the page own static shell only. Pass `searchParams` to a catalog section.
- The section owns a narrow `Suspense` boundary with the shared renderer in skeleton mode and an existing catalog error boundary.
- In an async query-content component, normalize awaited search params, start the first-page Server Action without awaiting it, and give the inner `Suspense` a deterministic key derived only from request-driving query values.
- The async content component consumes the typed Promise with `use()`, handles empty data through the shared empty boundary, and renders the shared renderer. Do not duplicate the resolved or skeleton catalog markup.
- Pass the normalized query and first-page response unchanged to the client catalog. URL filters, sorting, and pagination remain the authoritative state.

## Entity and transport boundaries

- The server action validates the catalog input, calls the entity service, and unwraps its result into the typed first page.
- The entity client module owns the catalog query-key factory and `useSuspenseInfiniteQuery` hook. Use a deterministic canonical query serialization in the key so equivalent filter state shares a cache entry.
- Seed the infinite query with exactly the server page: `initialPageParam`, `initialData.pages`, and `initialData.pageParams` must match that response's current page. Disable automatic client refetches when the server page is canonical for the route.
- The query function derives the next request from the normalized URL filters, `pageParam`, and the initial page's limit. Forward TanStack Query's `signal` to the entity client service.
- Use the backend response's `nextPage` as `getNextPageParam`; map `null` to `undefined`.
- The entity client service uses `internalFetcher` against the matching same-origin Route Handler. The handler independently validates query parameters, uses server-only `customFetcher`, and returns safe JSON. It must not expose backend credentials or bypass validation.
- Flatten pages in the hook and de-duplicate list items by stable entity ID before rendering.

## Client composition and recovery

- Put the infinite list under `QueryErrorResetBoundary`, the existing catalog error boundary wired with its query reset callback, and a local `Suspense` fallback rendered by the same grid/list renderer in skeleton mode.
- The list calls `fetchNextPage` only from the infinite-scroll trigger, uses `hasNextPage` for `hasMore`, and renders the flattened items through the normal renderer.
- Keep initial-fetch recovery and next-page recovery within the existing shared error fallback. Do not introduce page-specific error-boundary or load-error components for this flow.
- Reset or remount the infinite-list boundary with a deterministic key when URL-driving query state changes, so the initial server page and client query cannot mix.

## Tests

Add or update focused tests that prove:

- the Server Action forwards normalized validated input to the server service;
- the infinite hook does not request the initial page, requests the backend-provided next page with filters, limit, and abort signal, and has a key that changes with filters/sort;
- the Route Handler validates input and calls the backend without credentials for a public catalog;
- catalog UI covers server skeleton, resolved, empty, initial error recovery, and next-page error recovery.

Run focused tests, lint, typecheck, and the production build. Reuse the repository's existing renderer, skeleton data, error boundary, route handler wrapper, and pagination helpers instead of creating parallel abstractions.
