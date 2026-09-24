import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NeshanMapContextProvider } from '@/entities/map/map.client';

import { NeshanMapPointer } from './pointer';

const { markerAddTo, markerConstructor, markerOff, markerOn, markerRemove, markerSetLngLat } =
  vi.hoisted(() => ({
    markerAddTo: vi.fn(),
    markerConstructor: vi.fn(),
    markerOff: vi.fn(),
    markerOn: vi.fn(),
    markerRemove: vi.fn(),
    markerSetLngLat: vi.fn(),
  }));

let markerListeners = new Map<string, Array<(event: Event) => void>>();

vi.mock('@neshan-maps-platform/maplibre-sdk', () => ({
  default: {
    Marker: class Marker {
      constructor(options: unknown) {
        markerConstructor(options);
      }

      setLngLat(coordinates: unknown) {
        markerSetLngLat(coordinates);
        return this;
      }

      addTo(map: unknown) {
        markerAddTo(map);
        return this;
      }

      getLngLat() {
        return { lng: 51.4, lat: 35.7 };
      }

      on(event: string, listener: (event: Event) => void) {
        markerOn(event, listener);
        markerListeners.set(event, [...(markerListeners.get(event) ?? []), listener]);
        return this;
      }

      off(event: string, listener: (event: Event) => void) {
        markerOff(event, listener);
        markerListeners.set(
          event,
          (markerListeners.get(event) ?? []).filter((registered) => registered !== listener),
        );
        return this;
      }

      remove = markerRemove;
    },
  },
}));

afterEach(() => {
  markerListeners = new Map();
  vi.clearAllMocks();
});

function renderPointer(props: Partial<React.ComponentProps<typeof NeshanMapPointer>> = {}) {
  const map = {};
  return {
    map,
    ...render(
      <NeshanMapContextProvider value={{ map: map as never }}>
        <NeshanMapPointer lngLat={[51.389, 35.6892]} setLatLng={vi.fn()} draggable {...props}>
          <button type="button">نشانگر</button>
        </NeshanMapPointer>
      </NeshanMapContextProvider>,
    ),
  };
}

describe('NeshanMapPointer', () => {
  it('creates a core Marker from its options and adds it through map context', async () => {
    renderPointer({ anchor: 'bottom', clickTolerance: 4 });

    await waitFor(() => expect(markerConstructor).toHaveBeenCalledOnce());
    expect(markerConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        anchor: 'bottom',
        clickTolerance: 4,
        draggable: true,
        element: expect.any(HTMLDivElement),
      }),
    );
    expect(markerSetLngLat).toHaveBeenCalledWith([51.389, 35.6892]);
    expect(markerAddTo).toHaveBeenCalledWith(expect.anything());
  });

  it('synchronizes drag and DOM pointer events through props without duplicate listeners', async () => {
    const setLatLng = vi.fn();
    const onDrag = vi.fn();
    const onClick = vi.fn();
    const { map, rerender } = renderPointer({ setLatLng, onDrag, onClick });

    await waitFor(() => expect(markerOn).toHaveBeenCalled());
    markerListeners.get('drag')?.forEach((listener) => listener(new Event('drag')));
    expect(setLatLng).toHaveBeenCalledWith([51.4, 35.7]);
    expect(onDrag).toHaveBeenCalledWith(expect.any(Event));

    const markerElement = markerConstructor.mock.calls[0]?.[0]?.element as HTMLElement;
    markerElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));

    rerender(
      <NeshanMapContextProvider value={{ map: map as never }}>
        <NeshanMapPointer lngLat={[51.5, 35.8]} setLatLng={setLatLng} onDrag={onDrag} draggable>
          <button type="button">نشانگر</button>
        </NeshanMapPointer>
      </NeshanMapContextProvider>,
    );
    expect(markerConstructor).toHaveBeenCalledOnce();
    await waitFor(() => expect(markerSetLngLat).toHaveBeenLastCalledWith([51.5, 35.8]));
  });

  it('detaches every listener and removes the marker when unmounted', async () => {
    const { unmount } = renderPointer();

    await waitFor(() => expect(markerOn).toHaveBeenCalled());
    unmount();

    expect(markerOff).toHaveBeenCalledTimes(4);
    expect(markerRemove).toHaveBeenCalledOnce();
  });

  it('updates the controlled coordinate from a map click only when clickMap is enabled', async () => {
    const mapOn = vi.fn();
    const mapOff = vi.fn();
    const map = { on: mapOn, off: mapOff };
    const setLatLng = vi.fn();
    let onMapClick: ((event: { lngLat: { lng: number; lat: number } }) => void) | undefined;
    mapOn.mockImplementation((_event, listener) => {
      onMapClick = listener;
    });

    const { unmount } = render(
      <NeshanMapContextProvider value={{ map: map as never }}>
        <NeshanMapPointer lngLat={[51.389, 35.6892]} setLatLng={setLatLng} clickMap>
          <button type="button">نشانگر</button>
        </NeshanMapPointer>
      </NeshanMapContextProvider>,
    );

    await waitFor(() => expect(mapOn).toHaveBeenCalledWith('click', expect.any(Function)));
    onMapClick?.({ lngLat: { lng: 51.5, lat: 35.8 } });
    expect(setLatLng).toHaveBeenCalledWith([51.5, 35.8]);

    unmount();
    expect(mapOff).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
