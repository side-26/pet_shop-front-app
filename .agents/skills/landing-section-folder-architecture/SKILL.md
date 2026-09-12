---
name: landing-section-folder-architecture
description: Organize completed Next.js landing pages so each section owns its wrapper, async states, renderer, tests, and local helpers in a section-named folder. Use when creating or refactoring landing-page sections in this project; do not apply it to list or detail routes unless requested.
---

# Landing section folders

Keep a landing page as a small composition file and colocate each section's implementation beneath its page-local `_components` directory.

## Structure

- Use a kebab-case section folder such as `popular-products/` or `pet-types/`.
- Move the section wrapper, container, renderer, skeleton data, fetch-error UI, error boundary, local types/helpers/mappers, and focused tests into that folder.
- Put a helper in `shared/` only when two or more sibling sections import it. Do not duplicate it into each section.
- Update page and test imports after moving files; preserve relative imports within a moved section whenever possible.
- Keep list, detail, and other routes outside the refactor unless the request explicitly includes them.

## Preserve behavior

- A folder-only refactor must not alter public UI, route behavior, cache policy, Suspense boundaries, accessibility, or error/loading behavior.
- Keep the established server-section flow intact: wrapper starts the request, Suspense owns the fallback, async container resolves states, and the renderer supports skeleton data.
- Do not turn a Server Component into a Client Component merely to accommodate the folder layout.

## Verification

- Search for stale imports and old flat filenames after the move.
- Run focused landing tests, typecheck, lint, and a production build.
