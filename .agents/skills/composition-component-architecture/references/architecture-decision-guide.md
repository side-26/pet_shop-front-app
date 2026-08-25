# Architecture Decision Guide

Use this reference for substantial React or Next.js page work. It condenses the project-supplied composition and cache architecture source into decisions that materially change implementation.

## Inspect first

Confirm the Next.js version, App Router conventions, `cacheComponents`, local cache and Suspense patterns, `components.json`, local shadcn source, route-local structure, and current Server/Client boundaries. Local source is authoritative; do not assume Radix, Base UI, or React Aria APIs.

## Classify meaningful responsibilities

Mark each meaningful page section before extracting or moving it:

- `[S]` static/prerenderable Server Component
- `[C]` cached Server Component or cached data boundary
- `[D]` request-time Server Component behind nearby Suspense
- `[I]` smallest practical interactive Client Component

Prefer this order:

```text
Prerendered Server UI
  -> Cached Server UI
  -> Dynamic streamed Server UI
  -> Small interactive Client islands
```

Do not introduce `'use client'`, `'use cache'`, or Suspense without a concrete runtime, freshness, or streaming requirement.

## Extract responsibilities deliberately

Extract when a section owns a coherent feature responsibility, substantial compound primitive composition, a render/cache/client boundary, local state, accessibility relationships, independent change, or clearer import ownership. Line count alone is not a reason.

Pages should describe what the screen contains. Route-local components should own domain labels, routes, and feature composition. Keep design-system primitives generic.

Promote gradually:

```text
route-local -> entity/feature -> common application composition -> UI primitive
```

Require genuine reuse and stable responsibility before promotion.

## Review Client boundaries

`'use client'` creates a module-graph boundary. Before adding or broadening one, check whether:

- the boundary can move lower;
- static content can stay server-rendered or be passed as slots;
- URL state can replace shared local state;
- a Server Action can own a mutation;
- server rendering or Suspense can own data work.

Keep dialog visibility, popovers, temporary selections, and animation state near the interactive island. Prefer URL/search-parameter state for filters, sort, pagination, and search when it should survive refresh, support sharing/history, or drive server results.

## Review cache boundaries

For each async source decide whether it must be fresh per request, can prerender, or can safely use `'use cache'`. If cached, derive `cacheLife`, `cacheTag`, and invalidation from domain semantics and existing policy; never invent arbitrary durations.

Place caching near the reusable data responsibility. Do not cache a whole page because one child benefits. Keep request APIs out of incompatible cached scopes and pass serializable request-derived values into cached work only when valid.

When mutations affect cached reads, identify the matching `updateTag`, `revalidateTag`, or established project mechanism.

## Review Suspense and data flow

Keep server-capable fetching on the server. Start independent work concurrently and avoid component boundaries that serialize requests.

For Promise-backed regions, follow the repository's mandatory Wrapper -> Suspense -> async Container -> shared Renderer workflow. Use the same renderer and view-model shape for resolved and skeleton states. Keep unrelated requests behind independent boundaries.

Do not add Suspense to static local data or merely to organize JSX.

## Refactor checklist

Within the requested scope, look for large inline compound compositions, high Client boundaries, broad Suspense, client fetching that can remain server-side, misplaced state, page-specific code in UI primitives, duplicated stable compositions, needless wrappers, and waterfalls.

Preserve stronger repository conventions, existing helpers, route paths, fetchers, error normalization, skeleton strategy, tests, and shadcn customizations.
