---
name: composition-component-architecture
description: Design, implement, refactor, or review React and Next.js UI composition with deliberate Server, Cache Component, Suspense, Client Component, state-ownership, and feature-boundary decisions. Use for pages, layouts, templates, content sections, compound shadcn compositions, component extraction, or rendering/cache architecture; do not use for primitive API guidance alone.
---

# Component Composition and Cache Architecture

Build the largest practical prerenderable server tree and hydrate only the smallest interactive islands. Treat responsibility boundaries and rendering/cache boundaries as equally important.

Use this priority unless the product requirements or repository conventions demand otherwise:

```text
Prerendered Server UI
  -> Cached Server UI
  -> Dynamic streamed Server UI
  -> Small interactive Client islands
```

## Required companion guidance

- Follow the repository `AGENTS.md`, including its mandatory async-content workflow.
- For any UI component, layout, page, template, content section, state, accessibility, or component-test work, also load `shadcn-pet-ui-component` and run its composition gate.
- Use the `shadcn` skill for shadcn APIs and registry behavior. This skill governs architecture, not primitive API details.
- Read the relevant versioned Next.js guidance in `node_modules/next/dist/docs/` before writing code. Do not rely on remembered Next.js APIs.
- Load other project skills when their trigger applies, especially route, data-flow, caching, testing, and performance skills.

If a required reusable UI component is unavailable locally or through `/ui-components`, stop the dependent work, report saved progress, and wait for explicit authorization to add it.

## Inspect before deciding

Before changing React or Next.js UI, inspect only the relevant context:

1. Confirm the Next.js version, App Router conventions, and `cacheComponents` setting.
2. Read neighboring pages/components and the applicable Next.js docs.
3. Inspect existing caching, Suspense, loading, error, and route-local component patterns.
4. Inspect `components.json` and the source of each non-trivial local shadcn primitive used.
5. Identify existing Server and Client Component boundaries and request-driving inputs.
6. Preserve local folder, naming, fetcher, cache, Server Action, URL-state, skeleton, and testing conventions.

The local component source is authoritative. Never assume Radix, Base UI, React Aria, `asChild`, or another primitive API from memory.

## Classify meaningful sections

Classify each meaningful page section before selecting boundaries:

- `[S]` static or prerenderable Server Component
- `[C]` cached Server Component or cached data boundary
- `[D]` request-time dynamic Server Component streamed behind nearby Suspense
- `[I]` interactive Client Component

Aim for trees such as:

```text
ProductPage [S]
|- ProductBreadcrumb [S]
|- CategoryNavigation [C]
|- ProductToolbar [S]
|  `- ProductSortControl [I]
|- ProductGrid [C]
`- Recommendations [D]
```

Do not add `'use client'` because a component uses shadcn, is compound, has an interactive parent, or is conceptually capable of receiving callbacks. Add it only for a concrete client-runtime requirement such as stateful browser interaction, client hooks, or browser APIs. Move interactivity downward and pass server-rendered content through composition/slots where appropriate.

## Composition layers

Keep these ownership layers distinct:

1. **UI primitives** in `src/components/ui`: generic design-system styling, variants, accessibility, and primitive behavior.
2. **Feature or page compositions** near their consumer: domain labels, routes, feature-specific presentation, accessibility relationships, and local UI state.
3. **Page or layout composition**: major sections, data/rendering boundaries, and shared state coordination.

Pages should read as screen outlines rather than low-level primitive assembly. Do not put page-specific behavior in generic shadcn primitives or modify a primitive for one feature unless the change genuinely belongs to the design system.

Promote components gradually: page-local -> feature-local -> shared application component -> design-system primitive. Require demonstrated reuse or a stable abstraction before promotion.

## Extract deliberately

Extract a component when at least one meaningful signal exists:

- it owns a coherent domain responsibility;
- several primitives form one conceptual composition;
- the parent imports many low-level primitives solely for that section;
- it creates a useful static, cached, dynamic, Suspense, or client boundary;
- it owns local UI state or accessibility relationships;
- it changes independently for a coherent reason;
- extraction materially improves testability or parent readability.

Do not extract solely because JSX is long. Keep trivial cohesive markup inline. Prefer domain names such as `ProductFilterSheet` or `DeleteProductDialog`; avoid `Wrapper`, `CustomComponent`, and similarly vague names.

A compound component is not automatically a Client Component. A breadcrumb composition will often remain `[S]`, while an interactive filter sheet may be `[I]`.

## Async content and Suspense

For every Promise-backed content region, follow the repository's required architecture:

1. The page composes sections and does not own detailed loading markup.
2. A Server Component wrapper starts, but does not await, the typed data Promise; it owns the narrow Suspense boundary and renderer-backed fallback.
3. An async container receives and awaits the Promise, then normalizes success, empty, and error states.
4. A shared renderer renders resolved and skeleton view models, uses `isSkeleton?: boolean`, applies the global `.skeleton` class at the correct outer region, sets `aria-busy`, and disables skeleton interactions.

Use deterministic Suspense keys derived only from request-driving inputs when a reset is required. Keep unrelated async regions under separate boundaries. Do not await before the boundary, duplicate skeleton markup, fetch server-capable data with `useEffect`, make a whole page a Client Component for loading behavior, or use random keys.

Keep dynamic boundaries as narrow as practical so headings, breadcrumbs, navigation, descriptions, labels, SEO content, and other static/cached UI remain in the prerendered shell. Do not add Suspense merely for visual organization.

## Cache architecture

When `cacheComponents` is enabled, treat prerendering, `'use cache'`, `cacheLife`, `cacheTag`, Suspense, and server composition as first-class architecture tools.

- Cache only data/scopes that safely share freshness semantics.
- Place the cache boundary near the expensive or reusable data responsibility.
- Do not cache a whole page because one child benefits from caching.
- Derive lifetime and invalidation from domain behavior and existing project policy; never invent arbitrary durations.
- Identify which mutations require `updateTag`, `revalidateTag`, or the project's equivalent.
- Keep request APIs such as `cookies()` and `headers()` out of incompatible cached scopes. Read runtime values in a dynamic server boundary and pass serializable inputs into cached work when valid.
- Avoid boundaries that serialize independent requests; start independent work concurrently when appropriate.

Before adding client state, dynamic rendering, or uncached fetching, determine whether server composition or caching satisfies the need.

## State and data ownership

State belongs to the lowest common owner that requires it, but distinguish presentation state from application state.

- Keep dialog, sheet, popover, temporary visibility, animation, and similar UI state local to the interactive island.
- Give filters, sorting, pagination, search, cart, category, and authentication an authoritative shared source appropriate to their semantics.
- Prefer URL/search-param state when it should survive refresh, be shareable, participate in browser history, drive server fetching, or affect SEO-visible results.
- Keep data fetching server-side by default. Use client fetching only for a concrete requirement that prerendering, Cache Components, Server Components, Suspense, props, or Server Actions cannot satisfy.

## Scope discipline

When refactoring, note broad Suspense or client boundaries, misplaced page-specific primitives, duplicated compositions, needless wrappers, incorrect state ownership, missing invalidation, and fetch waterfalls. Fix only issues reasonably within the user's requested scope. Preserve stronger established repository conventions.

## Verification

Before completion, verify the behavior and architecture—not just file shape:

- Server Components remain the default and client boundaries are as low as practical.
- Static UI stays prerenderable; cache scopes have correct freshness and invalidation semantics.
- Dynamic regions use narrow, independent Suspense boundaries.
- Loading, loaded, empty, and normalized error states share the renderer and preserve layout.
- Skeleton interactions are disabled and accessibility state is correct.
- Pages expose feature responsibilities without over-componentizing trivial markup.
- URL state and server fetching were considered before client state/fetching.
- Component boundaries do not create request waterfalls.
- Relevant tests cover the touched states and boundaries.
- Typecheck, lint, applicable Vitest/Cypress tests, and production build pass.

Briefly report only the architectural decisions that materially shaped the implementation.
