'use client';

import type { ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { useNeshanMapContext } from '@/entities/map/map.client';

import type { NeshanMapCoordinates } from '../default';

type NeshanMapSdk = typeof import('@neshan-maps-platform/maplibre-sdk');
type Marker = InstanceType<NeshanMapSdk['default']['Marker']>;
type MarkerOptions = NonNullable<ConstructorParameters<NeshanMapSdk['default']['Marker']>[0]>;

type PointerEventCallback = (event: Event) => void;
type PointerDomEventCallback = (event: MouseEvent) => void;

export type NeshanMapPointerHandle = Omit<
  Marker,
  'setLngLat' | 'setPopup' | 'getPopup' | 'togglePopup' | 'on' | 'off' | 'once' | 'fire'
>;

export type NeshanMapPointerProps = Omit<MarkerOptions, 'anchor' | 'element'> &
  Readonly<{
    anchor?: MarkerOptions['anchor'];
    children: ReactNode;
    /** The controlled Marker coordinate tuple: `[longitude, latitude]`. */
    lngLat: NeshanMapCoordinates;
    /** Called after a marker movement or pointer interaction. */
    setLatLng: (lngLat: NeshanMapCoordinates) => void;
    onClick?: PointerDomEventCallback;
    onDblClick?: PointerDomEventCallback;
    onDragStart?: PointerEventCallback;
    onDrag?: PointerEventCallback;
    onDragEnd?: PointerEventCallback;
  }>;

function toCoordinates(marker: Marker): NeshanMapCoordinates {
  const { lng, lat } = marker.getLngLat();
  return [lng, lat];
}

function markerOptionsKey(options: MarkerOptions) {
  return JSON.stringify(options);
}

export const NeshanMapPointer = forwardRef<NeshanMapPointerHandle, NeshanMapPointerProps>(
  function NeshanMapPointer(
    {
      anchor,
      children,
      lngLat,
      setLatLng,
      onClick,
      onDblClick,
      onDragStart,
      onDrag,
      onDragEnd,
      ...markerOptions
    },
    ref,
  ) {
    const { map } = useNeshanMapContext();
    const markerRef = useRef<Marker | null>(null);
    const markerRootRef = useRef<Root | null>(null);
    const [marker, setMarker] = useState<Marker | null>(null);
    const callbacksRef = useRef({
      setLatLng,
      onClick,
      onDblClick,
      onDragStart,
      onDrag,
      onDragEnd,
    });
    callbacksRef.current = { setLatLng, onClick, onDblClick, onDragStart, onDrag, onDragEnd };

    const options: MarkerOptions = { ...markerOptions, anchor };
    const optionsKey = markerOptionsKey(options);
    const markerStateRef = useRef({ children, lngLat, options });
    markerStateRef.current = { children, lngLat, options };

    useImperativeHandle(ref, () => marker as NeshanMapPointerHandle, [marker]);

    useEffect(() => {
      markerRootRef.current?.render(children);
    }, [children]);

    useEffect(() => {
      if (!map) return;

      let cancelled = false;
      let currentMarker: Marker | null = null;
      const element = document.createElement('div');
      const root = createRoot(element);
      markerRootRef.current = root;
      root.render(markerStateRef.current.children);
      const disposeCallbacks: Array<() => void> = [];

      void import('@neshan-maps-platform/maplibre-sdk').then(({ default: maplibregl }) => {
        if (cancelled) return;

        currentMarker = new maplibregl.Marker({ ...markerStateRef.current.options, element })
          .setLngLat([...markerStateRef.current.lngLat])
          .addTo(map) as Marker;
        markerRef.current = currentMarker;
        setMarker(currentMarker);

        const emitPosition = () => callbacksRef.current.setLatLng(toCoordinates(currentMarker!));
        const addMarkerEvent = (
          event: 'dragstart' | 'drag' | 'dragend',
          callbackKey: 'onDragStart' | 'onDrag' | 'onDragEnd',
        ) => {
          const listener = (eventValue: Event) => callbacksRef.current[callbackKey]?.(eventValue);
          currentMarker!.on(event, listener);
          disposeCallbacks.push(() => currentMarker?.off(event, listener));
        };
        const addDomEvent = (
          event: 'click' | 'dblclick',
          callbackKey: 'onClick' | 'onDblClick',
        ) => {
          const listener = (eventValue: MouseEvent) => {
            emitPosition();
            callbacksRef.current[callbackKey]?.(eventValue);
          };
          element.addEventListener(event, listener);
          disposeCallbacks.push(() => element.removeEventListener(event, listener));
        };

        currentMarker.on('drag', emitPosition);
        disposeCallbacks.push(() => currentMarker?.off('drag', emitPosition));
        addMarkerEvent('dragstart', 'onDragStart');
        addMarkerEvent('drag', 'onDrag');
        addMarkerEvent('dragend', 'onDragEnd');
        addDomEvent('click', 'onClick');
        addDomEvent('dblclick', 'onDblClick');
      });

      return () => {
        cancelled = true;
        disposeCallbacks.forEach((dispose) => dispose());
        currentMarker?.remove();
        if (markerRef.current === currentMarker) markerRef.current = null;
        setMarker((value) => (value === currentMarker ? null : value));
        if (markerRootRef.current === root) markerRootRef.current = null;
        root.unmount();
      };
    }, [map, optionsKey]);

    useEffect(() => {
      markerRef.current?.setLngLat([...lngLat]);
    }, [lngLat]);

    return null;
  },
);

NeshanMapPointer.displayName = 'NeshanMapPointer';
