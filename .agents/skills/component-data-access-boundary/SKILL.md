---
name: component-data-access-boundary
description: Route component data access through entity Server Actions or an entity client-fetch layer in this Pet Shop frontend; use when adding or reviewing API-backed component reads.
---

# Component Data-Access Boundary

Components must not import entity `*.service` modules. Choose the boundary by the component's runtime:

- Server Components, pages, metadata functions, and server-rendered section wrappers call a thin entity Server Action.
- Client Components use an entity client-fetch layer, which calls a Server Action.
- Services remain `server-only` and own endpoint selection, typed `customFetcher` calls, `use cache` / `use cache: private`, `cacheLife`, `EntityTag` registration, and successful-mutation invalidation.

## Action rules

- Treat every action as an untrusted boundary: validate externally supplied input with the entity schema before delegating to its service.
- Keep read actions thin; they must not introduce cache directives, cache lifetimes, tags, or duplicate service validation.
- Keep retry actions separate from read actions. A retry action invalidates only its established query/detail tag and then calls `refresh()`.
- Keep mutation invalidation in the service after a confirmed successful backend result. Actions must not duplicate it.
- Do not call `updateTag`, `revalidateTag`, or `cacheLife` from components or client layers.

## Audit

Before completing component data work, search the affected route scope for imports matching `@/entities/**/*.service`. Production components must have none. Tests may mock actions, not services, when they exercise component wiring.

Preserve the repository's Suspense pattern: a server wrapper starts the action Promise without awaiting it, and an async container receives and awaits that Promise.
