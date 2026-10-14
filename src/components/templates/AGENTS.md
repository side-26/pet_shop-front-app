# Component Templates Workflow

`src/components/templates/` contains reusable implementation templates for recurring
component orchestration patterns. A template may compose third-party libraries,
TanStack Query, and project UI primitives, but it must remain domain-neutral.

## Infinite Query Scroll

`custom-infinite-scroll/` owns the retained-data failure state for a TanStack
infinite query. It composes `react-infinite-scroll-component` and accepts the
query's next-page state plus a feature-owned error fallback render function.

- Keep initial-query Suspense failures in the feature's `QueryErrorResetBoundary`
  and `ErrorStateBoundary`; this template does not replace that boundary.
- Pass `isFetchNextPageError`, not generic `isError`, so background refetches do
  not incorrectly replace pagination UI.
- The error fallback receives `retry`, which resets the local
  `QueryErrorResetBoundary` before requesting the next page again.
- Stop automatic infinite-scroll loading while a next-page error is displayed.
- Keep loaders, end messages, result renderers, and fallback copy feature-owned.
- Add an integration test whenever the template contract changes. Feature tests
  should cover only their fallback and rendered results, not this template's
  generic retry wiring.
