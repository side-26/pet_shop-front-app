---
name: admin-entity-page-architecture
description: Create, refactor, or review an `/admin/*` entity data page in this Next.js project using the established users and pet-type component structure. Use for admin list/table pages, their loading and error states, filters, pagination, row actions, status controls, create/detail/edit dialogs, or when aligning an admin entity page with project architecture.
---

# Admin Entity Page Architecture

Build admin entity pages from small components that each have one reason to change. Use
`src/app/admin/users` as the reference for paginated/filterable entities and
`src/app/admin/pet-type` as the reference for simpler entity lists.

Before implementation, read the current reference files rather than copying remembered code. Also follow
the repository `AGENTS.md`, the mandatory async-content workflow, and the applicable UI, entity-flow,
route-path, and testing skills.

## Single reason to change

Assign each responsibility to one owner. Do not combine responsibilities merely because the page is small.

- `page.tsx`: metadata and top-level page composition only.
- `<entity>-header-actions-wrapper.tsx`: await/parse asynchronous URL inputs needed by header controls.
- `<entity>-header-actions.tsx`: register admin layout actions and own only header-control UI state. Lazy-load create/filter dialogs.
- `<entity>-page-content-wrapper.tsx`: resolve page-level asynchronous URL inputs and pass normalized request inputs onward.
- `<entity>-table-wrapper.tsx`: start the list Promise, own the narrow `Suspense` boundary, deterministic key, and renderer-backed fallback.
- `<entity>-table-container.tsx`: await the typed Promise, normalize success/error/empty outcomes, map transport data, and call the renderer.
- `<entity>-table.tsx` or `<entity>-paginate-table.tsx`: render the table from a renderer-specific view model. It must not fetch, await, toast, navigate, or understand backend DTO details.
- `<entity>-table.types.ts`: define the renderer view model and page-level presentation types.
- `<entity>-table.mapper.ts`: perform pure DTO-to-view-model mapping and pagination normalization.
- `<entity>-table-skeleton-data.ts`: create deterministic placeholder view models for the real renderer.
- `<entity>-enabled-switch.tsx`: own one row's interactive enabled-state mutation and pending behavior.
- `<entity>-row-actions.tsx`: own the row action menu, confirmation orchestration, and lazy-loaded detail/edit dialog state.
- `create-<entity>-dialog.tsx`, `<entity>-detail-dialog.tsx`, or `<entity>-edit-dialog.tsx`: own one dialog composition and its form or detail presentation.
- `<entity>-filter.helpers.ts`: parse, normalize, and serialize filter/search-param values with pure functions.

If one file has multiple unrelated reasons to change, split it at the responsibility boundary. Do not split
trivial markup into components that only rename an element or forward props.

## Required composition

Use this flow for the main data region:

```text
page
  -> page content wrapper (URL/search-param inputs, when present)
    -> table wrapper (starts Promise + Suspense)
      -> table container (awaits + result handling + mapping)
        -> table renderer (view model only)
          -> small client islands (switch, row actions, dialogs)
```

Keep the page and table renderer as Server Components. Add `'use client'` only to interactive leaves.
Never make the entire page or table a Client Component to support row interactions.

## Async and skeleton contract

- Start the request in the table wrapper; do not await it there.
- Pass the typed Promise to the async container.
- Derive a `Suspense` key only from request-driving inputs when a reset is needed.
- Use the same table renderer for loaded and loading states.
- Feed skeleton view models from `<entity>-table-skeleton-data.ts`; never manufacture full backend DTOs.
- The renderer accepts `isLoading?: boolean`, applies `.skeleton`, sets `aria-busy`, prevents pointer/selection interaction, and explicitly disables interactive children.
- Keep pending, success-with-data, success-empty, and normalized error states distinct.
- Render normalized failures with the shared `Empty` composition or the established entity error presentation.

## Data and interaction boundaries

- The renderer consumes view models from `<entity>-table.types.ts`, not backend DTOs.
- The mapper is pure and contains no React, fetch, toast, navigation, or cache behavior.
- Server Components may start read actions/services according to the established entity flow.
- Client controls call client orchestration hooks or Server Actions; they do not import server-only services.
- Row actions start detail requests only after the user selects the action.
- Lazy-load create, filter, detail, and edit dialogs so closed dialogs are not in the initial client bundle.
- Mutation success may close a dialog and refresh the route; failures flow unchanged to `globalErrorHandler`.
- Use the shared confirmation dialog for destructive actions.
- Keep status mutation pending state local to the affected interactive control unless the backend operation truly blocks the whole table.

## UI and route rules

- Compose from existing `src/components/ui` primitives and common components. Run the project UI composition gate before adding page content.
- Configure page-level admin actions through `AdminLayoutContextValue.headerActions`.
- Use canonical paths from `src/configs/route.path.ts` for pagination, links, redirects, and navigation.
- Preserve RTL semantics, accessible labels, screen-reader-only action headers, and `<bdi dir="ltr">` for LTR identifiers.
- Use the shared table and pagination compositions. A non-paginated endpoint must not gain fake pagination merely to match filenames.

## Choosing the reference

Read the relevant current files before creating a new page:

- Use `src/app/admin/users/_components` when the entity has filters, search params, pagination, row status updates, create/detail dialogs, or multiple table view-model fields.
- Use `src/app/admin/pet-type/_components` when the entity is a non-paginated list with a simpler request shape.

Copy responsibilities and dependency direction, not entity-specific fields, labels, endpoints, cache keys, or validation rules.

## Tests and completion

Add tests at the boundary whose responsibility changed:

- wrapper: starts the action with all request-driving inputs and uses the deterministic key;
- container: maps success and renders normalized error/empty states;
- renderer: loaded rows, display fallbacks, RTL/LTR semantics, and busy non-interactive skeleton behavior;
- switch: correct action, pending state, success refresh, and complete error forwarding;
- row actions/dialogs: request starts only after selection, lazy dialog opens/closes, populated data, mutation success, and failure behavior;
- filter helpers/header wrapper: URL parsing and initial filter state.

Before completion, run focused Vitest tests, TypeScript, ESLint, applicable Cypress tests, and the production
build. Confirm the page remains a composition outline, async boundaries are narrow, skeleton markup is not
duplicated, and every component has one clear reason to change.
