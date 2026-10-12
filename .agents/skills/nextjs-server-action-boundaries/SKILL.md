---
name: nextjs-server-action-boundaries
description: Build or refactor independently streamed, server-rendered Next.js read sections using Server Actions, React `use()`, Suspense skeletons, custom error-boundary fallbacks, and custom empty-state fallbacks. Use whenever a page, layout, template, or server section loads promise-backed data through a Server Action; do not use for TanStack Query, browser fetching, or client form mutations.
---

# Next.js Server Action Async Boundaries

Use the project’s Server Action → service → `customFetcher` flow for independently streamed Server Component read sections. Keep the page and content component server-rendered; do not add client data hooks, SWR, or TanStack Query.

This pattern gives each state one owner:

```text
Server Action  → validates/authenticates, unwraps fetch failures, returns valid data or throws
Section        → starts the Promise; owns Suspense and ErrorStateBoundary
Content        → uses the Promise and selects the semantic empty state
Renderer       → renders valid data or its skeleton view model only
```

Use it for server-rendered reads and previews. Do not apply it to client-triggered form mutations: those normally need returned structured validation errors for field-level UI.

## Inspect first

Read the affected action, service, DTOs, existing nearby section, and these real project APIs:

- `unwrapResult`: `@/lib/utils`
- `ErrorStateBoundary`: `@/components/ui/error-state-boundary`
- `EmptyStateBoundary`: `@/components/ui/empty-state-boundary`
- `FetchErrorSection`: `@/components/common/fetch-error-section`

Follow the nearest section architecture, especially `src/app/(default)/_components/home/offers/`. Do not invent a new fetch or error-boundary abstraction.

## Section shape

```text
section.tsx                 starts the Server Action Promise; owns Suspense and ErrorStateBoundary
section-content.tsx         calls use(promise); selects empty or valid data
section-renderer.tsx        renders valid data and the skeleton view model
section-skeleton-data.ts    renderer-shaped placeholders, when useful
section-empty-fetch.tsx     feature-specific Empty fallback
section-error-fallback.tsx  feature-specific ErrorStateBoundary fallback, when reusable
```

The wrapper starts the request but does not await it. Its static heading/copy stays outside the boundary:

```tsx
const dataPromise = getSectionAction(input);

return (
  <Suspense fallback={<SectionRenderer data={skeletonData} isSkeleton />}>
    <SectionErrorBoundary>
      <SectionContent dataPromise={dataPromise} />
    </SectionErrorBoundary>
  </Suspense>
);
```

`ErrorStateBoundary` is a Client Component. When its fallback needs the boundary-provided `retry` callback, create a feature-local `*ErrorBoundary` Client Component that owns `fallbackRender` and composes `FetchErrorSection`. A Server Component must not pass a function through `fallbackRender` or `onRetry`; those props cannot cross the Server-to-Client boundary.

The renderer must support `isSkeleton`, apply `.skeleton` to the outer visual region, set `aria-busy`, and make any skeleton interactions unavailable. Do not duplicate the renderer’s layout in loading markup.

## Action and content contract

The read action is the boundary for service/result contracts. It validates untrusted input, authenticates/authorizes when required, then unwraps the service result:

```tsx
export async function getSectionAction(input: unknown) {
  await requireAuthenticated();
  const value = await unwrapValidate(validate(sectionInputSchema, input));
  return unwrapResult(service.getSection(value));
}
```

Do not return `FetcherResult<T>` to section components and do not make components inspect `isSuccess`. A rejected validation, authentication, authorization, or service promise bubbles to the nearest `ErrorStateBoundary`. Do not catch it and turn it into empty data.

The content component resolves the promise with React `use()` rather than being an `async` component:

```tsx
export function SectionContent({ dataPromise }: { dataPromise: Promise<SectionData | null> }) {
  const data = use(dataPromise);

  return (
    <EmptyStateBoundary
      data={data}
      fallback={<SectionEmptyFetch />}
      isEmpty={() => !data?.id}
    >
      <SectionRenderer data={data} />
    </EmptyStateBoundary>
  );
}
```

Use a feature-local `*EmptyFetch` component composed from the shared `Empty` primitives. For collections, use the natural array-empty predicate; for detail data, pass an explicit semantic predicate such as `!data?.id`. The shared `EmptyStateBoundary` supports both cases through `isEmpty`.

## Recovery

- Use `ErrorStateBoundary` with a feature-specific `FetchErrorSection` composition and its provided retry/reset callback.
- Do not assume an error-boundary reset alone refetches Server Component data; copy the nearest proven retry pattern.

## Cache and safety

Preserve the service’s cache policy. Public shareable content may use `'use cache'`, explicit `cacheLife`, and `EntityTag`; authenticated or draft content must stay private (`'use cache: private'`) or uncached. Keep credentials and backend URLs server-only.

## Verify

Test the action’s unwrapped rejection contract, renderer skeleton behavior, valid data, semantic empty data, and the error-boundary fallback. Confirm retries target only the section’s cache scope. Run focused tests, lint, typecheck, and the applicable build checks.
