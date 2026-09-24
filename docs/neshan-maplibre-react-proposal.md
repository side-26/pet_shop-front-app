# Proposal: `neshan-maplibre-react`

`neshan-maplibre-react` would be a React-first integration for the Neshan MapLibre SDK. Its purpose is to make common map UI composable, typed, safe to mount and unmount, and pleasant to use in both React and Next.js applications—without hiding the underlying Neshan/MapLibre capabilities.

## The problem it solves

The Neshan SDK already provides a capable MapLibre-compatible map. In a React application, however, a developer must still manage several imperative concerns themselves:

- creating and removing the map at the right lifecycle boundary;
- loading a client-only SDK safely in Next.js;
- sharing the map instance with markers and controls without prop drilling;
- rendering React content inside a MapLibre `Marker` element;
- keeping a draggable or map-click-selected marker in sync with React state;
- detaching every MapLibre and DOM event listener; and
- removing markers and React roots when the component unmounts.

Those details are repetitive and easy to get wrong. A React package should own them once, while retaining an escape hatch to the native MapLibre instance.

## Proposed package surface

```text
neshan-maplibre-react/
├─ NeshanMap                 # map lifecycle, context provider, base options
├─ useNeshanMap              # access to the ready map instance
├─ NeshanMapPointer          # React-rendered MapLibre Marker
├─ NeshanMapPluginWrapper    # fixed-corner overlay layout
├─ pointer icons              # optional presentational helpers
└─ Next.js helpers            # dynamic-import and Suspense recipes
```

The package should be framework-agnostic at its core. Next.js guidance and helpers can be provided as a documented integration path, rather than making the map primitive Next-specific.

## `NeshanMap`: one owner for the map lifecycle

`NeshanMap` is a client component that creates the Neshan SDK map, exposes a small imperative handle, and removes the map on teardown.

```tsx
<NeshanMap
  apiKey={process.env.NEXT_PUBLIC_NESHAN_API_KEY}
  center={[51.389, 35.6892]}
  zoom={12}
  copyRightPosition="bottom-left"
  onMapLoad={(map) => console.log('Map ready', map)}
>
  {children}
</NeshanMap>
```

Important defaults and capabilities:

- The standard coordinate order is always `[longitude, latitude]`, matching MapLibre.
- Copyright attribution defaults to `bottom-left`; applications may override it.
- The Neshan MapLibre SDK is loaded only in the client lifecycle.
- Consumers can use `ref.current?.flyTo(...)` and `ref.current?.getMap()` for advanced cases.
- The map instance is also shared through context, so plugins do not need a raw map prop.
- On unmount, observers are disconnected and `map.remove()` is called.

## Context instead of prop drilling

Plugins need the actual map instance to call `marker.addTo(map)`, subscribe to map events, or create custom controls. Context is the correct ownership boundary:

```tsx
const { map } = useNeshanMapContext();
```

The provider belongs inside `NeshanMap`, so a plugin cannot accidentally attach to the wrong map. Plugins can wait until `map` is non-null and cleanly do nothing while the map is initializing.

## `NeshanMapPointer`: declarative marker state, imperative escape hatch

The pointer component wraps the core MapLibre `Marker` class. It creates a real marker, renders React `children` into the marker element, and adds the marker to the context map.

```tsx
const [lngLat, setLngLat] = useState<readonly [number, number]>([51.389, 35.6892]);

<NeshanMapPointer
  lngLat={lngLat}
  setLatLng={setLngLat}
  anchor="bottom"
  draggable
  clickMap
  onDragEnd={() => analytics.track('address_pin_dragged')}
>
  <LocationPin aria-label="Selected delivery location" />
</NeshanMapPointer>;
```

### Controlled coordinate contract

`lngLat` is the controlled input. `setLatLng` is the single callback for position changes caused by dragging the marker or clicking the map when `clickMap` is enabled.

This keeps React state authoritative:

1. A user drags the marker or clicks the map.
2. The pointer calls `setLatLng([lng, lat])`.
3. The application updates state.
4. The new `lngLat` prop updates the actual MapLibre marker.

`clickMap` defaults to `false`. This avoids surprising map-click behavior in ordinary display maps, while enabling location-picking flows with one opt-in prop.

### Marker options and events

The component accepts MapLibre `MarkerOptions`, including `anchor`, `draggable`, `offset`, `rotation`, `opacity`, and click tolerance. Its React event props cover marker and DOM interaction:

- `onClick`
- `onDblClick`
- `onDragStart`
- `onDrag`
- `onDragEnd`
- `onMapClick` when `clickMap` is enabled

Popup composition is intentionally excluded. Popups should be a separate component with its own lifecycle and accessibility contract, rather than an implicit side effect of creating a marker.

### Ref access

A forwarded ref offers the remaining non-popup Marker APIs for exceptional imperative work, such as rotation, opacity, element access, or drag configuration. Position updates remain prop-driven, so imperative calls cannot silently make React state stale.

## Leak-safe lifecycle rules

Lifecycle correctness should be a core promise of the library, not an application responsibility.

For every pointer instance, the package must:

1. Create one DOM element and one React root.
2. Create one MapLibre marker and call `addTo(map)`.
3. Attach marker listeners and DOM listeners exactly once.
4. Use callback refs so changed React callbacks do not accumulate MapLibre listeners.
5. On dependency change or unmount, detach every listener, call `marker.remove()`, and unmount the React root.
6. Ignore a delayed SDK import after unmount, preventing an orphan marker from being created.

This approach prevents memory leaks, stale callbacks, duplicate event delivery, and detached React roots.

## Overlay plugins

`NeshanMapPluginWrapper` provides a small layout primitive for controls that belong in a fixed map corner:

```tsx
<NeshanMapPluginWrapper position="top-left">
  <ProvinceSelector onSelect={flyToProvince} />
</NeshanMapPluginWrapper>
```

The wrapper should own only fixed positioning. Feature-specific controls—such as a province selector backed by an application's own API—should remain outside the core package or be shipped as optional adapters. This keeps the package reusable for delivery, real-estate, store-locator, fleet, and dashboard applications.

## Next.js integration

The package should document a first-class Next.js pattern:

```tsx
const AsyncAddressMap = dynamic(() => import('./address-map'), { ssr: false });

<Suspense fallback={<AddressMapSkeleton aria-busy="true" />}>
  <AsyncAddressMap />
</Suspense>;
```

For forms and dialogs, the outer dialog shell should render immediately. Only the map body should be dynamically loaded behind a narrow Suspense boundary. The fallback should preserve the map area's dimensions, apply a visible skeleton state, and disable interaction, avoiding layout shift and accidental input during loading.

## Example: address location picker

This feature demonstrates how the primitives compose without adding address-specific behavior to the library:

```tsx
<NeshanMap center={[51.389, 35.6892]} copyRightPosition="bottom-left">
  <NeshanMapPointer
    lngLat={selectedLngLat}
    setLatLng={setSelectedLngLat}
    anchor="bottom"
    draggable
    clickMap
  >
    <NeshanMapPointerIcon.Root aria-label="Selected address location" />
  </NeshanMapPointer>

  <NeshanMapPluginWrapper position="top-left">
    <ProvinceSelector
      defaultProvinceId={8}
      onProvinceSelect={({ latLng }) => setSelectedLngLat([latLng[1], latLng[0]])}
    />
  </NeshanMapPluginWrapper>
</NeshanMap>
```

The application can then send `[latitude, longitude]` to its own address or reverse-geocoding API, while the map package consistently uses MapLibre's `[longitude, latitude]` convention.

## Recommended package guarantees

- TypeScript-first public API and exported coordinate types.
- No global mutable marker registry.
- No leaked MapLibre or DOM listeners after unmount.
- No SDK initialization during server rendering.
- Explicit, documented coordinate order at every boundary.
- Controlled marker-position support with an opt-in map-click picker.
- Access to native MapLibre capabilities when declarative props are insufficient.
- Integration tests for mount, prop update, drag, click, listener cleanup, and unmount behavior.

## Suggested package name

`@neshan-maps-platform/maplibre-react` is clearer and matches the existing SDK namespace. `neshan-maplibre-react` is also a suitable unscoped package name if that better fits the publishing strategy.

## Areas for Deeper Consideration

While the proposal is strong, a few points warrant further thought during implementation.

### The Decision to Exclude Popups

The proposal intentionally excludes popup composition, arguing that popups should be a separate component with their own lifecycle. This is a defensible design choice to keep the pointer component focused. However, popups are a ubiquitous map UI pattern. Leaving them out of the core package means every application will need to rebuild the same imperative glue to attach a popup to a marker.

A better approach may be to ship a separate, well-designed `NeshanMapPopup` component in the same package. This keeps the concerns separate while still providing a cohesive out-of-the-box solution.

### The `useNeshanMap` Hook

The proposal mentions a `useNeshanMap` hook for accessing the ready map instance, while an earlier implementation uses `useNeshanMapContext()`. The public API should use one name consistently. A useful pattern is a single hook that returns both the map instance and an `isLoaded` boolean, simplifying consumer logic:

```tsx
const { map, isLoaded } = useNeshanMap();
```

The final naming and return contract should be agreed before publishing, avoiding an unnecessary breaking change later.

### Handling Imperative Escape Hatches

The proposal correctly identifies the need for an escape hatch through `ref.current?.getMap()` and a forwarded pointer ref. The key implementation challenge is preventing imperative calls from desynchronizing React state. For example, if a developer calls `marker.setLngLat()` via a ref, the controlled `lngLat` prop becomes stale.

The package documentation must clearly warn about this and direct consumers to the controlled API for position updates. Ideally, the public pointer-ref type should omit `setLngLat()` entirely, leaving `lngLat` and `setLatLng` as the only supported position-update path.

## Why this is valuable

The proposal does not replace the Neshan SDK. It gives React teams a safe, familiar composition layer over it. Developers get declarative components for common work, Neshan retains the full MapLibre model underneath, and product teams spend less time rebuilding fragile lifecycle glue for every map screen.
