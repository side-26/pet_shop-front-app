---
name: shadcn-pet-ui-component
description: Create, add, redesign, review, fix, or update UI components for the Pet Shop design system. Always use this skill for prompts involving UI primitives, shadcn components, component APIs or variants, visual states, forms, overlays, navigation controls, cards, RTL UI behavior, component motion, accessibility, UI tests, or related component documentation.
---

# Shadcn Pet UI Component

Build Pet Shop UI components on the existing shadcn/Base UI foundation. Preserve primitive behavior and accessibility, then adapt components to the repository's semantic tokens, RTL-first architecture, testing strategy, and premium visual language.

## Required workflow

1. Read applicable `AGENTS.md` files completely.
2. Inspect `components.json`, the component, its usages, sibling UI components, tokens, helpers, and tests.
3. Read the repository's `shadcn` skill and use the project's package runner for shadcn commands.
4. Reuse an existing component before adding or creating one.
5. If the component exists in shadcn but is missing locally, inspect its current docs and add it through the established shadcn workflow.
6. Never overwrite unrelated local customization or blindly regenerate customized components.
7. Implement the requested contract, migrate call sites when necessary, and update meaningful tests and applicable `AGENTS.md` documentation.
8. Create or update the `/ui-components` living gallery for every added or changed UI component.
9. Run focused tests and the repository's actual validation commands.

## Architecture and boundaries

- Preserve shadcn/Base UI anatomy, portals, ARIA semantics, keyboard behavior, focus management, refs, controlled/uncontrolled behavior, native props, events, and composition props.
- Do not collapse composable primitives into monolithic wrappers.
- Extend existing prop types instead of recreating them. Do not swallow events.
- Preserve Server Components. Add `'use client'` only for state, effects, browser APIs, client hooks, or interactive primitives.
- Use the existing variant mechanism (`cva`, `tv`, or project helper). Do not introduce another variant library.
- Avoid mega-components, duplicate token systems, unnecessary contexts, and wrappers that only rename primitives.

## Shared visual API

When semantically meaningful, support:

```ts
size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
variant: 'fill' | 'outlined' | 'tonal' | 'flat' | 'text' | 'transparent'
color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
```

Default to `md`, `fill`, and `primary` when those axes apply. Do not create fake visual props for providers, portals, contexts, slots, or structural helpers. Do not create variants that render identically.

## Styling

- Use semantic Tailwind tokens such as `bg-primary`, `text-primary-foreground`, `bg-success-muted`, and `border-error-border`.
- Do not hardcode hex/OKLCH values or use primitive scales for normal reusable states.
- Do not scatter standard theme behavior across component-level `dark:*` overrides.
- Choose readable foregrounds intentionally for every filled or tonal surface.
- Use existing typography, spacing, radius, elevation, and motion tokens.
- Prefer logical Tailwind properties and `cn()` for conditional classes.

## States

Evaluate and implement only relevant states:

- default, hover, pressed, focus-visible
- selected, checked, indeterminate
- loading, disabled, read-only
- success, invalid/error, warning
- empty

Prefer native, ARIA, or `data-*` selectors over duplicate React state. Loading controls must preserve dimensions, prevent duplicate activation when appropriate, avoid layout shift, and expose their state accessibly.

## RTL and mixed direction

- Design RTL-first and use logical start/end naming and spacing.
- Use `startIcon` and `endIcon`, never left/right API names.
- Ensure breadcrumbs, pagination, navigation chevrons, drawers, steppers, menus, and directional Lucide icons follow RTL meaning.
- Isolate LTR runs such as prices, order numbers, tracking codes, phone numbers, SKUs, emails, URLs, and English product names with `<bdi>` or `dir="ltr"` when appropriate.
- Test realistic Persian content, long labels, mixed scripts, wrapping, zoom, and narrow viewports.

## Accessibility

- Target WCAG AA contrast and visible `focus-visible` states.
- Preserve keyboard behavior, accessible names, labels, descriptions, and focus restoration.
- Use `aria-invalid` and `aria-describedby` for form errors when applicable.
- Never communicate status, selection, or availability by color alone.
- Icon-only controls require accessible names; decorative icons must be hidden from assistive technology.
- Keep disabled states readable and primary mobile targets approximately 44×44 px where practical.

## Icons and motion

- Use Lucide only unless the repository explicitly establishes another icon source.
- Scale icons consistently with component size and use logical spacing.
- Use restrained project motion tokens to communicate state or hierarchy.
- Respect `prefers-reduced-motion`; functionality and meaning must not depend on animation.
- Avoid excessive bounce, scale, blur, glow, gradients, and decorative motion.

## Visual language

Aim for friendly, calm, trustworthy, clean, warm, modern, and premium UI. Use rounded geometry, restrained elevation, and clear hierarchy. Reserve glass treatment for navigation, floating controls, overlays, dialogs, drawers, and contextual elevated surfaces. Prefer opaque or semi-opaque surfaces for forms, grids, tables, dense cards, admin UI, and content-heavy areas.

## Living component gallery

- Treat `src/app/ui-components/page.tsx` (`/ui-components`) as the canonical visual inventory for `src/components/ui`.
- Create the route when it does not exist. Whenever a UI component is added or its public API, styling, states, or behavior changes, update the route in the same change.
- Inventory every public component family under `src/components/ui`; exclude tests, helpers, and documentation files.
- Render meaningful examples of every supported visual axis, including colors, variants, sizes, and relevant states such as disabled, loading, invalid, selected, empty, open, and RTL/mixed-direction content. Do not manufacture states or axes the component does not support.
- Exercise full shadcn composition for compound components. Keep labels realistic, Persian-first, and accessible; isolate LTR identifiers with `<bdi>` or `dir="ltr"`.
- Keep the page a Server Component and static by default. Move only genuinely interactive showcase logic into the smallest route-local Client Component. Apply the mandatory Promise/Suspense workflow only when a gallery region is Promise-backed.
- Use responsive, semantic-token-based gallery layout without redefining component styling at the call site. Add or update focused route tests so missing component sections or broken public composition are detected.

## Testing

- Use the repository's existing testing stack; never introduce a duplicate framework.
- Add focused Vitest/RTL tests for React contracts and Cypress tests for real-browser interaction when warranted.
- For interactive UI, cover relevant activation, keyboard, focus, open/close, Escape, disabled/loading, form-state, and RTL behavior.
- Prefer role, accessible name, label, and visible text selectors. Avoid sleeps, animation timing assumptions, class selectors, and internal DOM selectors.
- Update existing tests when APIs or behavior change; never weaken valid tests to pass.

## Documentation

Update the applicable `AGENTS.md` when a component change alters public API, variants, states, composition, RTL behavior, accessibility, testing expectations, or directory conventions. Document current behavior only and avoid redundant instruction files.

## Completion report

Report the component and primitive used, sizes/variants/colors, relevant states, RTL and accessibility decisions, motion/reduced-motion behavior, tests and documentation changed, validation run, and intentional breaking changes or limitations.

Do not declare completion until relevant architecture, behavior, accessibility, RTL, light/dark, responsive-content, documentation, tests, lint, TypeScript, and build checks have been addressed.
Do not declare a UI component change complete until `/ui-components` represents the current component inventory and supported conditions.
