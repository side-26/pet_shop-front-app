---
name: manage-route-paths
description: Centralize Next.js page paths when creating, renaming, moving, or editing routed pages and their navigation references. Use for App Router page work, Link href values, redirects, router navigation, navigation configuration, and route-aware tests in this repository.
---

# Manage Route Paths

Keep every application path canonical and reusable so pages, navigation, and tests cannot drift apart.

## Workflow

1. Inventory the affected `src/app/**/page.tsx` routes and their references before editing. Remember that route-group directory names such as `(auth)` do not appear in the URL.
2. Keep canonical paths in `src/configs/route.path.ts`. Create the file when it is missing.
3. Export a readonly `routePaths` object with stable, semantic keys. Group keys only when it materially improves clarity.
4. Add, update, or remove a constant whenever its routed page changes. A navigation target without a page may remain only when the existing product flow intentionally references that future route.
5. Import `routePaths` through `@/configs/route.path` in `Link` href values, redirects, `router.push` or `router.replace` calls, navigation data, and route-aware tests. Do not repeat application path literals outside the route configuration.
6. For dynamic routes, query strings, or hashes, add a typed path builder when interpolation is required. Do not spread manual string concatenation across callers.
7. Preserve Next.js file conventions and Server Component defaults while changing pages.
8. Update relevant tests, then run typecheck, lint, applicable Vitest or Cypress tests, and the production build.

## Review Checklist

- Every added or changed page has a canonical entry in `src/configs/route.path.ts`.
- Every affected navigation reference imports the canonical constant or builder.
- Route groups and dynamic segments produce the intended public URL.
- Tests assert navigation using the same canonical route source.
- No unrelated route literals were changed.
