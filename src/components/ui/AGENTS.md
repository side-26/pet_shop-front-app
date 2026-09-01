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

`ExpandableCard` is the client-side compound composition for vertically clipped
card content. Compose `ExpandableCard.Root`, `ExpandableCard.Content`, and
`ExpandableCard.Trigger` together; content and trigger must remain inside the
root. Root inherits the shared `Card` props and accepts `defaultExpanded`.
Content requires a pixel `collapsedHeight`, supports `fadeHeight` and
`showFade`, and uses `ResizeObserver` to keep its expanded height synchronized
with dynamic content. Trigger inherits the shared `Button` props, uses the
Button `block` API, and supports state-specific `collapsedLabel` and
`expandedLabel`; explicit children remain unchanged across states. Preserve its
native button behavior, `aria-expanded`/`aria-controls` relationship, focus,
and cancellable `onClick` contract: a consumer that calls `preventDefault()`
must prevent the internal toggle. Use semantic card colors for the trigger
surface, and keep both height and fade transitions disabled under reduced
motion. Represent collapsed and initially expanded states in `/ui-components`;
cover the React contract with Vitest and focus/browser interaction with Cypress
Component Testing.

`Avatar` composes Base UI Avatar with `size="sm|default|lg"`, defaulting to `default`.
Always provide `AvatarFallback`; use `AvatarBadge` for a separately named status when needed.

`Price` accepts a numeric `number`, `prefix="$|ریال|تومان"`, and root
`className`. It formats values with Persian thousands separators, isolates the
numeric run as LTR, places `$` before the number, and places rial/toman after it.

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
`HoverCard` composes Base UI Preview Card with `HoverCardTrigger` and
`HoverCardContent`. Its portalled content uses semantic popover tokens, logical
RTL positioning, configurable trigger delays, and reduced-motion-safe transitions.
`Spinner` uses the same semantic colors with `size="xs|sm|md|lg|xl"`.

`DialogContent` uses `size="sm|md|lg|xl"` and always requires `DialogTitle`;
include `DialogDescription` for explanatory content. Toast uses the Base UI toast
manager and resolves `fill|outlined|tonal` foregrounds from semantic color.
`DrawerContent` supports only `color="primary|secondary|info|success|warning|error"`;
it intentionally has no `variant` or `size` API. Every drawer requires a `DrawerTitle`,
should include `DrawerDescription`, and preserves Base UI swipe direction, snap points,
nested drawers, focus management, and Escape behavior.
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

`Toggle` and `ToggleGroup` use Base UI and share Button's
`size="xs|sm|md|lg|xl"`,
`variant="fill|outlined|tonal|flat|text|transparent"`, and
`color="primary|secondary|info|success|warning|error"` axes. They default to
`md`, `flat`, and `primary`. A single-select Base UI `ToggleGroup` uses an
array value without a `multiple` prop; add `multiple` for multi-selection.
`ToggleGroup` supports horizontal or vertical orientation and numeric spacing;
spacing zero joins item borders with logical RTL-safe start/end radii. Preserve
native `aria-pressed`, roving keyboard focus, disabled behavior, and visible
focus/selected states. Use `ToggleGroup` for option sets of two to seven choices
instead of manually coordinating Button pressed state.

`Tabs` composes Base UI `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.
Set only `color="primary|secondary|info|success|warning|error"` and
`size="xs|sm|md|lg|xl"` on the `Tabs` root; child parts inherit both values.
`TabsList` supports the native `variant="default|line"`; its line indicator inherits the
root color and trigger size. Keep every `TabsTrigger` inside a
`TabsList`, pair every trigger value with its `TabsContent`, and preserve Base UI
keyboard, disabled, focus, orientation, and RTL behavior. `TabsContent` uses Base UI's
activation-direction data state for short transform/opacity-only slide transitions. The root
uses a shared grid cell for panels so entering and exiting content does not stack or shift the
layout during the transition; reduced motion disables the transition.

`Menubar` composes Base UI Menubar with the shared Dropdown Menu parts and is
non-modal by default. Labels and checkbox items belong inside `MenubarGroup`;
radio items belong inside `MenubarRadioGroup`. Preserve RTL arrow-key movement,
submenus, disabled items, shortcuts, and destructive semantic styling.

`Field` and `FieldLabel` live in `ui/field/default.tsx` and `ui/field/label.tsx`.
Set `data-invalid` or `data-disabled` on `Field`, associate `FieldLabel` with its
control through `htmlFor`, and mirror invalid or disabled state on the control.

Form controls live under `ui/fields`: `Input`, `InputGroup`, `Select`, `Switch`,
`Checkbox`, and `RadioGroup`. Compose `InputGroup` only with `InputGroupInput`
and `InputGroupAddon`; place every `SelectItem` in `SelectGroup`. Base UI Select
roots require the complete `items` collection. Controls use native/ARIA invalid
and disabled state and are designed RTL-first.
`SelectField` is the React Hook Form composition for single-value selects. It
consumes the nearest `FormProvider`, accepts a typed `name` and `{ value, label,
disabled? }` options. Option values may be strings, booleans, or `null`; `null`
is preserved in React Hook Form for an explicit unfiltered state. It owns the `Field`, label, Select parts, and a persistent
hint/error description. It binds the Select hidden input and selected value to
React Hook Form, and exposes placeholder, required, disabled, and read-only
states without duplicating select markup at call sites. Its
`size="xs|sm|md|lg|xl"` API defaults to `md` and uses the same label and
hint/error typography scale as `TextField`, `TextareaField`, and `InputOtpField`.
`Input` supports `color="primary|secondary|info|success|warning|error"` and
`size="xs|sm|md|lg|xl"`, defaulting to primary/md. Color controls border, caret,
and focus ring; `aria-invalid` always resolves to the error treatment. Input and
Textarea control typography resolves to 12/12/14/14/16px across the size scale.
Telephone and password inputs automatically use the shared `mixedDirectionInput`
behavior: entered values remain LTR while Persian placeholders remain RTL. A
password field keeps this behavior while its visibility toggle renders it as text.
`Textarea` uses the same color and size axes, with size controlling its minimum
height and typography. It remains vertically resizable unless disabled.
`TextField` is the React Hook Form-aware composition for textual form controls.
It consumes the nearest `FormProvider`, accepts a typed field `name`, and owns
`Field`, `FieldLabel`, `Input`, and an always-mounted description region. Its
color and size propagate to the input, label, icons, spacing, and description.
Labels remain size-aware and never exceed 16px; persistent hint/error descriptions
never exceed 13px and sit closer to the control than the control sits to its label.
Use `prefixIcon` and `postfixIcon` for inline decorative icons. Password fields
automatically provide an accessible visibility toggle and preserve form state.
The password toggle keeps a size-aware hit target, uses a smaller icon than the
target, and is inset from the logical end edge; reserve matching input end
padding so text never collides with it in RTL or LTR.
`TextareaField` mirrors `TextField` composition and React Hook Form integration
without password behavior. When `counter` is true, render a live character
count at the physical bottom-left of the textarea, include `maxLength` when
provided, and reserve bottom padding so user text cannot overlap the counter.
`InputOTP`, `InputOTPGroup`, `InputOTPSlot`, and `InputOTPSeparator` are the
project-owned shadcn Input OTP primitives backed by `input-otp`. `InputOtpField`
is their React Hook Form composition with `color="primary|secondary|info|success|warning|error"`
and `size="xs|sm|md|lg|xl"`. It defaults to six numeric slots, keeps slots LTR
inside RTL forms, exposes `focusOnMount`, persistent hint/error messaging,
`onFinished(value)`, and optional `submitOnFinished` through the owning `Form`.
Slot geometry and typography scale together from 28px/12px to 48px/16px.
`Checkbox`, `Switch`, and `RadioGroupItem` support `fill|outlined|tonal` through
`variant`, plus independent `checkedColor` and `uncheckedColor` semantic colors.
Checked/on/ticked and unchecked/off/unticked states must resolve their own
surface and foreground. Disabled states always override both colors with a
readable neutral border, surface, foreground, and cursor treatment. Read-only
Checkbox and RadioGroupItem states do the same; read-only Switches remain
non-interactive while preserving their checked/unchecked semantic colors for
status display.
All three controls also support `size="xs|sm|md|lg|xl"`. Size scales Checkbox
and Radio indicators or the Switch track/thumb, writes `data-size` on the
control, and causes the associated `FieldLabel` typography to scale with it.
`Switch` also supports `loading`. A loading switch disables activation, exposes
`aria-busy`, and renders a `text-foreground` spinner within its `bg-background`
thumb so it remains readable in both light and dark themes.
`CheckboxField`, `SwitchField`, and `RadioGroupField` are the React Hook Form
compositions for selection controls. They consume the nearest `FormProvider`,
bind through typed `name`, and render a persistent hint/error description.
They expose the underlying variant, checked/unchecked colors, size, disabled,
and read-only APIs. `RadioGroupField` receives accessible `{ value, label }`
options and associates the group label and error description with the group.
Their label and hint/error typography use the same scale as textual fields for
the corresponding size.

`Form` lives under `ui/form`, wraps React Hook Form with `FormProvider`, accepts
`handleSubmit`, optional `handleInvalid`, `validationSchema`, and `options`, and
supports render-prop children. Its forwarded ref exposes the complete typed
`UseFormReturn`; use it for imperative `reset`, `setValue`, `trigger`, focus, and
other React Hook Form operations rather than creating a second form state.

`Countdown` receives a non-negative duration through `seconds`, supports
`color="primary|secondary|info|success|warning|error"` and
`size="xs|sm|md|lg|xl"`, and accepts root `className` and native div props. It
always renders two-digit minutes and seconds, adds an hours segment only when
at least one hour remains, and exposes `reset()` through `CountdownRef` to
restart from the latest `seconds` prop. Optional `children` replace the digits
only when the inner counter reaches zero; without children, zero remains
`00:00`. Expired child content inherits the surrounding text direction instead
of the active counter's forced LTR direction. Its split-flap digit transition uses
Framer Motion, corrects interval drift against a deadline, stops at zero, keeps
the numeric run LTR in RTL interfaces, and becomes immediate under reduced motion.

`Counter` supports controlled `value` and uncontrolled `defaultValue`, clamps values to
`min` and `max`, and disables increment/decrement actions at their respective bounds. It uses
the shared `size="xs|sm|md|lg|xl"`,
`variant="fill|outlined|tonal|flat|text|transparent"`, and
`color="primary|secondary|info|success|warning|error"` axes. Keep its icon actions accessibly
named and its localized numeric output isolated as LTR. Its forwarded `CounterRef` exposes the
latest clamped `value` through `useImperativeHandle`. When `min={0}` and the value is `1`, its
decrement action becomes an equal-sized trash-can removal action. Prefer the error icon color
except on filled surfaces, where it inherits the current action foreground for accessible contrast.
Its numeric value transitions vertically with Framer Motion on increment and decrement while the
fixed-size action controls and counter group remain stable; reduced motion disables the transition.

`ThemeToggle` provides `light|dark|system` appearance modes. It persists the
preference under `petshop-theme`, applies `.dark` to the root element, and keeps
the browser `color-scheme` synchronized. Use the default `segmented` variant
when all three preferences must remain visible and `variant="icon"` on compact
navigation surfaces; the icon variant toggles the resolved light/dark mode with
an accessible action label. All primitives must use semantic color
tokens so the existing light and dark token maps theme components and portalled
surfaces consistently; do not add component-local hardcoded dark colors.

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
