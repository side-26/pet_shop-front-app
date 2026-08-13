# UI Components Workflow

## Purpose

This workflow governs:

```text
src/components/ui/
```

It is intended for **Codex** and **Claude Code**.

This folder is the frontend implementation of the project's design-system primitives.

The expected pipeline is:

```text
Figma Design System
        ↓
Figma MCP
        ↓
shadcn/ui
        ↓
Tailwind CSS tokens
        ↓
tailwind-variants
        ↓
components/ui
```

---

# Responsibility

A UI component must be domain-neutral.

Ask:

> Could this component be used without knowing what Product, Pet, Cart, Order, User, Address, or Auth means?

If yes, it may belong here.

Examples:

```text
button.tsx
input.tsx
textarea.tsx
checkbox.tsx
select.tsx
dialog.tsx
sheet.tsx
tooltip.tsx
badge.tsx
card.tsx
tabs.tsx
accordion.tsx
skeleton.tsx
spinner.tsx
```

Domain components belong under:

```text
entities/<entity>/components/
```

---

# shadcn/ui Rule

Prefer using or adapting an existing shadcn/ui primitive before creating a new primitive from scratch.

Once a shadcn component is added to this repository, treat it as project-owned source code.

It must follow:

```text
Figma design system
project tokens
Tailwind conventions
tailwind-variants conventions
accessibility requirements
testing requirements
```

Do not repeatedly reinstall/overwrite customized components without inspecting existing modifications.

---

# Figma Implementation Workflow

For a Figma-driven component:

1. Inspect the exact design-system component through Figma MCP.
2. Identify its variants and states.
3. Identify token usage:
   - colors
   - spacing
   - typography
   - radius
   - shadows
4. Compare against existing project tokens.
5. Reuse existing tokens whenever possible.
6. Use shadcn/Radix primitive behavior where applicable.
7. Implement supported visual variants using `tailwind-variants`.
8. Keep unsupported one-off page styles outside the primitive.
9. Verify accessibility and browser behavior.
10. Add tests.

Do not blindly paste generated MCP output.

---

# tailwind-variants

Use `tailwind-variants` for reusable variant/state APIs.

Typical dimensions:

```text
variant
size
intent
state
```

Example conceptual API:

```tsx
<Button variant="fill" color="primary" size="md" />
<Button variant="tonal" color="error" size="sm" />
```

Avoid creating separate components such as:

```text
primary-button.tsx
secondary-button.tsx
danger-button.tsx
```

when one variant-based component is sufficient.

---

# Current Foundation Components

`Button` and `Badge` share the following visual axes:

```text
size: xs | sm | md | lg | xl
variant: fill | outlined | tonal | flat | text | transparent
color: primary | secondary | info | success | warning | error
```

Both default to `md`, `fill`, and `primary`. Button icons use logical
`data-icon="inline-start|inline-end"` placement; icon-only buttons use
`iconOnly` plus an accessible name.

Resolve foreground color from `color` and `variant` together. Filled surfaces
use `<color>-foreground`; tonal surfaces use `<color>-muted-foreground`;
outlined, flat, text, and transparent surfaces use a readable semantic color
with the matching border/background treatment. Do not let these variants
inherit the surrounding foreground or use an unrelated neutral text color.

`Card` uses `size="xs|sm|md|lg|xl"` and
`variant="elevated|filled|outlined|glass"`. Compose it with `CardHeader`,
`CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`.

`AlertDialogContent` uses `size="sm|md|lg"`. Every alert dialog must include
an `AlertDialogTitle` and should include an `AlertDialogDescription`. Use
`AlertDialogCancel` for the focus-restoring close action; choose the semantic
`color` on `AlertDialogAction` for the confirmation intent.

Dialog footer semantics are standardized: `DialogCancel` and
`AlertDialogCancel` use `outlined + error`; `DialogAction` and
`AlertDialogAction` use `fill + primary`. Use structural `DialogClose` only
for non-action close affordances such as a title-bar close icon.

`PopoverContent` and `TooltipContent` use `color="primary|secondary|info|success|warning|error"`.
Their `fill`, `outlined`, and `tonal` variants resolve foreground, background,
border, and (for Tooltip) arrow color as one compound visual decision.
`Spinner` uses the same semantic colors with `size="xs|sm|md|lg|xl"`.

`DialogContent` uses `size="sm|md|lg|xl"` and always requires `DialogTitle`;
include `DialogDescription` for explanatory content. Toast uses the Base UI toast
manager and resolves `fill|outlined|tonal` foregrounds from semantic color.
Its viewport is top-centered, and its close control inherits the resolved toast
foreground so error, success, info, and warning notifications remain visually aligned.
`CollapsibleContent` preserves Base UI state/ARIA behavior while Framer Motion
animates height and opacity, with reduced-motion producing an immediate transition.

`DropdownMenu` is non-modal by default and closes on any captured scroll event,
including window and nested scrolling containers. Preserve its complete group,
checkbox, radio, separator, shortcut, and submenu composition. `Pagination` uses
semantic navigation markup, Persian labels, `xs|sm|md|lg|xl` sizing, and RTL-aware
previous/next arrows. Links accept the shared `variant` and `color` axes; when
`variant` is omitted, active links are outlined and inactive links are flat.
`DropdownMenuLabel` and checkbox items must be placed inside `DropdownMenuGroup`;
radio items must be placed inside `DropdownMenuRadioGroup`, as required by Base UI.

`DataTable` composes TanStack Table v8 with the shared `Table` renderer and owns
sorting, pagination, empty state, and stable row IDs. `Carousel` uses Embla with
`direction="rtl"` by default; in RTL, previous uses a right chevron, next uses a
left chevron, ArrowRight moves previous, and ArrowLeft moves next. `ButtonGroup`
supports horizontal and vertical orientations and joins child borders using
logical start/end properties.

`Menubar` composes Base UI Menubar with the shared Dropdown Menu parts and is
non-modal by default. Labels and checkbox items belong inside `MenubarGroup`;
radio items belong inside `MenubarRadioGroup`. Preserve RTL arrow-key movement,
submenus, disabled items, shortcuts, and destructive semantic styling.

The transparent and glass variants are reserved for elevated or contextual
macOS-style surfaces. Default cards remain opaque for content readability.

---

# Styling

Use Tailwind and project design tokens.

Avoid repeated arbitrary values when a design token should exist.

Do not make primitives aware of page-specific spacing.

Keep the design-system API intentional rather than exposing unlimited arbitrary styling props.

`className` may be supported according to existing repository conventions, but should not become a replacement for missing design-system variants.

---

# Dependencies

Allowed:

```text
React
Next.js primitives when appropriate
shadcn/Radix dependencies
tailwind-variants
generic helpers
generic hooks
```

Forbidden:

```text
entities
domain stores
server actions
business DTOs
business schemas
domain calculations
page components
layouts
common components
```

---

# Accessibility

Accessibility is mandatory.

Examples:

```text
Button → semantic button
Dialog → focus management and Escape behavior
Select → keyboard navigation
Tabs → correct roles and keyboard behavior
Input → label/error association
Icon button → accessible name
```

Preserve accessible behavior supplied by shadcn/Radix.

---

# Testing Model

UI components may have both Vitest Integration and Cypress Component tests when they test different responsibilities.

## Vitest Integration

Naming:

```text
button.integration.test.tsx
dialog.integration.test.tsx
```

Use for fast React contract testing:

```text
props
callbacks
accessible roles
disabled/loading state
conditional rendering
variant API behavior when meaningful
```

## Cypress Component

Naming:

```text
dialog.component.cy.tsx
select.component.cy.tsx
sheet.component.cy.tsx
```

### Required when the primitive has meaningful real-browser interaction

Examples:

```text
Dialog
Select
DropdownMenu
Popover
Tooltip
Combobox
Command
Drawer
Sheet
Tabs
Accordion
DatePicker
ContextMenu
NavigationMenu
```

Use Cypress Component Testing for:

```text
keyboard interaction
focus movement
focus restoration
Escape
portals
visibility
pointer interaction
open/close behavior
disabled interaction
browser event behavior
```

### Optional for simple primitives

Usually unnecessary for:

```text
Badge
Separator
Skeleton
simple Card
static typography
simple Label
```

A Button may need Cypress Component coverage if project-specific interaction/state behavior justifies it, but it is not required merely because it is a component.

## Cypress E2E

Do not use E2E to test a primitive in isolation.

E2E covers the primitive indirectly through real application journeys.

---

# Avoid Duplicate Tests

Bad:

```text
Vitest: button is disabled
Cypress Component: button is disabled
E2E: button is disabled
```

with no additional behavioral purpose.

Prefer:

```text
Vitest
→ React contract

Cypress Component
→ browser interaction

E2E
→ business/user journey
```

---

# Helpers

Use:

```text
<component>.helpers.ts
```

for reusable pure logic.

Do not add `.utils.ts`.

---

# Client Boundary

Do not automatically add `'use client'`.

Add it only when required.

Keep interactive boundaries as small as possible.

---

# Agent Workflow

Before creating/modifying a UI component:

1. Inspect the Figma design-system definition when applicable.
2. Search existing UI primitives.
3. Inspect existing shadcn implementation/customization.
4. Reuse before creating.
5. Confirm domain neutrality.
6. Map Figma values to project tokens.
7. Implement reusable variants with `tailwind-variants`.
8. Preserve shadcn/Radix accessibility.
9. Add/update Vitest Integration coverage.
10. Add/update Cypress Component coverage for meaningful browser behavior.
11. Run relevant component tests.
12. Run typecheck and lint.
13. Do not weaken existing tests.

---

# Definition of Done

```text
[ ] Domain-neutral
[ ] Existing primitive reused when possible
[ ] Figma contract implemented
[ ] shadcn/Radix behavior preserved
[ ] Design tokens used
[ ] tailwind-variants used appropriately
[ ] Props strictly typed
[ ] Accessibility correct
[ ] Vitest Integration coverage appropriate
[ ] Cypress Component coverage exists for meaningful browser interaction
[ ] No duplicated meaningless tests
[ ] TypeScript passes
[ ] ESLint passes
```
