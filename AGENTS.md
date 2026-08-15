<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mandatory async content workflow

When creating or modifying pages, templates, layouts, or any content section, follow the workflow in `C:\Users\chief\Downloads\async-content-suspense-skeleton-workflow.md` for every Promise-backed content region.

The required architecture is:

1. The Page composes sections and does not own detailed loading markup.
2. A Server Component Wrapper starts (but does not await) the data Promise, owns the `Suspense` boundary and fallback, and uses a deterministic key derived only from request-driving inputs when a reset is needed.
3. An async Container receives and awaits the typed Promise, then handles success, empty, and normalized error states.
4. A shared Renderer renders both resolved data and skeleton placeholder/view-model data. Use `isSkeleton?: boolean`, apply the global `.skeleton` class at the appropriate outer region, set `aria-busy`, and disable skeleton interactions.

Do not create separate skeleton cards, lists, grids, tables, or duplicated loading markup when the real renderer can safely represent the loading layout. Do not fetch server-capable data with `useEffect`, make whole pages Client Components for loading behavior, await the request before its Suspense boundary, combine unrelated async regions under one boundary, or use random Suspense keys.

Keep `customFetcher`, endpoint data functions, cache policy, Suspense orchestration, result handling, and presentation separate. Prefer renderer-specific view models over fake or weakened backend DTOs for placeholder data. Preserve the established `.skeleton` selector and spelling.

Before considering the work complete, add or update relevant tests and run typecheck, lint, applicable Vitest/Cypress tests, and the production build. Verify loading, loaded, empty, and error states; layout stability; disabled skeleton interactions; Server Component defaults; and the absence of duplicate skeleton markup.

## Pet Shop UI component skill

For every prompt involving UI components, primitives, component variants or states, forms, overlays, navigation controls, cards, RTL component behavior, component accessibility, motion, or UI component tests, use the project skill at `.agents/skills/shadcn-pet-ui-component/SKILL.md` in addition to any other applicable skills.

For every layout, page, template, or content-section task, also run that skill's UI composition gate before implementation. Use existing `src/components/ui` components. If a required reusable component is missing locally or from `/ui-components`, stop the dependent work, report the missing component and saved progress, and wait for explicit authorization to add it.
