---
name: neshan-map
description: Create or update Neshan Map plugins in this project, including map-overlay controls, indicators, and plugin composition.
---

# Neshan Map Plugins

Use this skill when creating or changing a plugin for `NeshanMap`.

## Location and structure

- Keep Neshan Map plugins in `src/components/ui/map/neshan-map/plugins/`.
- When a plugin is a single React component, create one `.tsx` file in that directory.
- When a plugin has separate React components, place it in a directory under `plugins/` and name its public entry point `default.tsx`.
- Keep plugin tests beside the component they cover.

## Composition

- Render plugins as children of `NeshanMapPluginWrapper` so the wrapper owns their fixed map-corner placement and alignment.
- `NeshanMap` exposes map-child context through its render-prop child. When a plugin needs that data, pass the relevant values from `NeshanMapChildrenContext` into the plugin from that render result; do not duplicate map state or fetch it independently.
- Preserve the map's render-prop API: if both static and context-aware overlays are required, return all wrappers from the single child function.
- Reuse the position values from `@/entities/map/map.dto` through `NeshanMapPluginWrapper`; do not define additional corner-position unions in a plugin.

## Implementation

- Keep plugins server-compatible unless they need state, effects, event handlers, or browser APIs. Add `'use client'` only when needed.
- Use existing UI primitives for interactive controls and preserve their accessibility contracts.
- Add focused tests for the plugin's public behavior and update the `/ui-components` gallery when the plugin is public.
