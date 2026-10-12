---
name: nextjs-server-action-boundaries
description: Build or refactor server-rendered Next.js async sections that fetch through Server Actions and handle loading, expected fetch failures, empty data, and render errors. Use for Server Action flows only; do not use for TanStack Query or other browser-fetching flows.
---

# Next.js Server Action Async Boundaries

Use the project’s Server Action → service → `customFetcher` flow for independently streamed Server Component sections. Keep the page and data container server-rendered; do not add client data hooks, SWR, or TanStack Query.

## Inspect first

Read the affected action, service, DTOs, existing nearby section, and these real project APIs:

- `FetcherResult<T>`: `@/lib/api/customFetcher`
- `unwrapResult`: `@/lib/utils`
- `ErrorStateBoundary`: `@/components/ui/error-state-boundary`
- `EmptyStateBoundary`: `@/components/ui/empty-state-boundary`
- `FetchErrorSection`: `@/components/common/fetch-error-section`

Follow the nearest section architecture, especially `src/app/(default)/_components/home/offers/`. Do not invent a new fetch or error-boundary abstraction.

## Section shape

```text
section.tsx                 starts the Server Action Promise; owns Suspense
section-container.tsx       awaits it; selects fetch-error, empty, or success
section-renderer.tsx        renders data and the skeleton view model
section-skeleton-data.ts    renderer-shaped placeholders, when useful
section-fetch-error.tsx     expected FetcherResult failure + targeted retry
section-error-boundary.tsx  unexpected render-error fallback
```

The wrapper starts the request but does not await it. Its static heading/copy stays outside the boundary:

```tsx
const dataPromise = getSectionAction(input);

return (
  <Suspense fallback={<SectionRenderer data={skeletonData} isSkeleton />}>
    <SectionErrorBoundary>
      <SectionContainer dataPromise={dataPromise} />
    </SectionErrorBoundary>
  </Suspense>
);
```

The renderer must support `isSkeleton`, apply `.skeleton` to the outer visual region, set `aria-busy`, and make any skeleton interactions unavailable. Do not duplicate the renderer’s layout in loading markup.

## Result selection

Actions normally preserve `Promise<FetcherResult<T>>`. The async container awaits that Promise and handles each result deliberately:

1. `!result.isSuccess`: render the feature-specific fetch-error component. This is an expected backend failure, not an empty state.
2. Successful but empty collection: use `EmptyStateBoundary` with a feature-specific `Empty` fallback.
3. Successful data: map DTOs to a view model and render the shared renderer.

`EmptyStateBoundary` accepts only `readonly unknown[] | null | undefined`; use it for collections, not arbitrary objects. For a nullable detail object, make the empty decision explicitly in the container and render the shared `Empty` composition.

Use `unwrapResult(promise, message)` only when the existing action/section contract intentionally converts a failed `FetcherResult` into a thrown render error. Never catch that error and reclassify it as empty data.

## Recovery

- Expected fetch failures use a `*FetchError` client adapter around `FetchErrorSection`. Its retry calls a dedicated Server Action that invalidates only the affected tag/query and calls `refresh()` from `next/cache`.
- Unexpected render errors use `ErrorStateBoundary` (or the existing local `catchError` boundary) with `FetchErrorSection` and the provided retry/reset callback.
- Do not assume an error-boundary reset alone refetches Server Component data; copy the nearest proven retry pattern.

## Cache and safety

Preserve the service’s cache policy. Public shareable content may use `'use cache'`, explicit `cacheLife`, and `EntityTag`; authenticated or draft content must stay private (`'use cache: private'`) or uncached. Keep credentials and backend URLs server-only.

## Verify

Test renderer skeleton behavior, successful data, successful empty data, expected `FetcherResult` failure, and unexpected error-boundary fallback. Confirm retries target only the section’s cache scope. Run focused tests, lint, typecheck, and the applicable build checks.
