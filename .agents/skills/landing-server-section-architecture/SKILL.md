---
name: landing-server-section-architecture
description: Create or refactor an API-backed server-rendered landing-page section with isolated Suspense, renderer-backed skeletons, targeted fetch retries, and error recovery.
---

# Landing Server Section Architecture

Use this skill for an independently fetched, public landing-page section. It establishes the project pattern used by the home pet-types and offers sections. Do not use it for a whole-page error boundary, client-side query state, or authenticated admin data pages.

## Target shape

Keep the section server-rendered by default and divide responsibility into small, named files near the section:

```text
section.tsx                         Server wrapper: starts the Promise and owns Suspense
section-container.tsx               Async Server Component: awaits and selects state
section-renderer.tsx                Resolved and skeleton presentation
section-skeleton-data.ts            Renderer view model for placeholders
section-fetch-error.tsx             Client retry adapter for expected API failures
section-error-boundary.tsx          Client catchError boundary for unexpected render failures
```

Use these layers only when each has a distinct responsibility; keep trivial section markup colocated rather than extracting wrappers by habit.

## Server wrapper and skeleton

- Start the typed service Promise in the Server Component wrapper without awaiting it.
- Put a narrow `Suspense` boundary around only the async content region. Preserve headings, explanatory copy, and other static shell content outside it.
- Use the real renderer for the fallback with renderer-specific skeleton data and `isSkeleton` enabled. The renderer must apply the project `.skeleton` class, expose `aria-busy`, and make placeholder interactions unavailable.
- Keep independent sections under independent boundaries. Use a deterministic key only when request-driving inputs require reset behavior.

## Container state selection

The async container accepts the Promise and awaits it. It must explicitly handle:

1. Successful non-empty data: map DTOs to the renderer view model and render it.
2. Successful empty data: render the section's intentional empty state, or `null` when the section should disappear.
3. Normalized service failure (`!result.isSuccess`): render the section-specific `*FetchError` adapter with the normalized message.

Do not catch normalized service failures in the error boundary, fetch with `useEffect`, or turn the wrapper/container into client components.

## Error and retry boundaries

Expected fetch failures and unexpected rendering failures have different recovery paths.

- The `*FetchError` client adapter composes `FetchErrorSectionBoundary`, supplies the section title/message, and passes a section-specific Server Action to `onRetry`.
- The retry action invalidates only the deterministic query tag(s) used by that section's landing service cache, then calls `refresh()` from `next/cache`. It must not broadly refresh unrelated landing data.
- The `catchError` boundary surrounds the async container inside the same Suspense boundary. Its fallback logs enough context for diagnosis and renders `FetchErrorSectionBoundary` with `retry` for unexpected rendering failures.
- `FetchErrorSectionBoundary` owns its client cooldown and hard page-reload control. Do not replace targeted retry with `router.refresh()` or `window.location.reload()`.

## Cache alignment

Follow the existing landing service and `EntityTag` convention:

- Assign a stable query key from the request-driving inputs.
- Register both the list and query tags at the cached service-result layer and provide them to the underlying fetch where the service establishes that convention.
- Invalidate the exact query key after a relevant successful mutation; do not invalidate it if that mutation fails.
- Add a dedicated landing retry action only when a section needs a user-initiated recovery path.

## Verification

Add or update focused tests for the relevant states: skeleton renderer contract, data, empty, expected API failure and retry adapter, and unexpected boundary failure. Confirm mutation tests cover targeted invalidation only after success. Run the applicable Vitest tests, TypeScript, lint, and production build; report environmental build blockers separately from code failures.

Also follow the repository `AGENTS.md`, `composition-component-architecture`, `shadcn-pet-ui-component`, and the applicable entity/cache workflow skills.
