'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import { type Map as NeshanMapInstance } from '@neshan-maps-platform/maplibre-sdk';
import '@neshan-maps-platform/maplibre-sdk/style.css';

import { cn } from '@/lib/utils';
import { NeshanMapPointerIcon } from './plugins/icons/pointer';
import { resolveMapStyleCssVariables, type MapStyle } from './style-css-variables';

const DEFAULT_CENTER = [51.389, 35.6892] as const;

export type NeshanMapCoordinates = readonly [longitude: number, latitude: number];
type NeshanMapSdk = typeof import('@neshan-maps-platform/maplibre-sdk');
type NeshanMapMarker = InstanceType<NeshanMapSdk['default']['Marker']>;

export type NeshanMapChildrenContext = Readonly<{
  mapCoordinate: NeshanMapCoordinates;
}>;

export type NeshanMapHandle = Readonly<{
  flyTo: (
    center: NeshanMapCoordinates,
    options?: Omit<Parameters<NeshanMapInstance['flyTo']>[0], 'center'>,
  ) => void;
  addNewPointer: (coordinates: NeshanMapCoordinates) => NeshanMapMarker | null;
  getMap: () => NeshanMapInstance | null;
}>;

export type NeshanMapProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> &
  Readonly<{
    apiKey?: string;
    center?: NeshanMapCoordinates;
    zoom?: number;
    zoomControl?: boolean;
    /** A fixed MapLibre style. When provided, it takes precedence over the themed styles. */
    style?: MapStyle;
    lightStyle?: MapStyle;
    darkStyle?: MapStyle;
    children?: ReactNode | ((context: NeshanMapChildrenContext) => ReactNode);
    onMapLoad?: (map: NeshanMapInstance) => void;
  }>;

export const NeshanMap = forwardRef<NeshanMapHandle, NeshanMapProps>(function NeshanMap(
  {
    apiKey = process.env.NEXT_PUBLIC_NESHAN_API_KEY,
    center = DEFAULT_CENTER,
    zoom = 12,
    zoomControl = true,
    style,
    lightStyle,
    darkStyle,
    className,
    children,
    onMapLoad,
    ...sectionProps
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NeshanMapInstance>(null);
  const markerConstructorRef = useRef<NeshanMapSdk['default']['Marker']>(null);
  const pointerMarkersRef = useRef<Array<Readonly<{ marker: NeshanMapMarker; root: Root }>>>([]);
  const [mapCoordinate, setMapCoordinate] = useState<NeshanMapCoordinates>(center);

  const clearPointers = useCallback(() => {
    for (const { marker, root } of pointerMarkersRef.current) {
      marker.remove();
      root.unmount();
    }
    pointerMarkersRef.current = [];
  }, []);

  const addNewPointer = useCallback((coordinates: NeshanMapCoordinates) => {
    const map = mapRef.current;
    const Marker = markerConstructorRef.current;

    if (!map || !Marker) {
      return null;
    }

    const element = document.createElement('div');
    element.className = 'tw:pointer-events-none';

    const root = createRoot(element);
    flushSync(() => {
      root.render(<NeshanMapPointerIcon.Root />);
    });

    const mapCoordinate: NeshanMapCoordinates = [coordinates[0], coordinates[1]];
    const marker = new Marker({ anchor: 'bottom', element })
      .setLngLat([...mapCoordinate])
      .addTo(map);

    pointerMarkersRef.current.push({ marker, root });
    setMapCoordinate(mapCoordinate);

    return marker;
  }, []);

  const getThemedStyle = useCallback(
    async (isDark: boolean): Promise<MapStyle> => {
      const configuredStyle = isDark ? darkStyle : lightStyle;

      if (configuredStyle) {
        return configuredStyle;
      }

      const styleModule = isDark
        ? await import('./them/dark.styles.json')
        : await import('./them/light.styles.json');
      return styleModule.default as unknown as MapStyle;
    },
    [darkStyle, lightStyle],
  );

  const createMap = useCallback(
    async (container: HTMLDivElement, mapStyle: MapStyle) => {
      const { default: maplibregl } = await import('@neshan-maps-platform/maplibre-sdk');
      markerConstructorRef.current = maplibregl.Marker;

      const map = new maplibregl.Map({
        apiKey,
        center: [...center],
        container,
        style: mapStyle,
        zoom,
      });

      if (zoomControl) {
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
      }

      return map;
    },
    [apiKey, center, zoom, zoomControl],
  );

  const createThemeObserver = useCallback(
    (map: NeshanMapInstance, initialIsDark: boolean) => {
      let isDark = initialIsDark;

      return new MutationObserver(() => {
        const nextIsDark = document.documentElement.classList.contains('dark');

        if (nextIsDark === isDark) {
          return;
        }
        isDark = nextIsDark;

        void getThemedStyle(nextIsDark).then((nextStyle) => {
          if (mapRef.current === map) {
            map.setStyle(resolveMapStyleCssVariables(nextStyle));
          }
        });
      });
    },
    [getThemedStyle],
  );

  useImperativeHandle(
    ref,
    () => ({
      flyTo: (center, options) => {
        mapRef.current?.flyTo({ ...options, center: [...center] });
      },
      addNewPointer,
      getMap: () => mapRef.current,
    }),
    [addNewPointer],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !apiKey) {
      return;
    }

    let cancelled = false;
    let map: NeshanMapInstance | null = null;
    let observer: MutationObserver | null = null;
    const initialIsDark = document.documentElement.classList.contains('dark');

    void (async () => {
      const initialStyle = resolveMapStyleCssVariables(
        style ?? (await getThemedStyle(initialIsDark)),
      );
      const initializedMap = await createMap(container, initialStyle);

      if (cancelled) {
        initializedMap.remove();
        return;
      }

      map = initializedMap;
      mapRef.current = map;
      onMapLoad?.(map);

      if (!style) {
        observer = createThemeObserver(map, initialIsDark);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearPointers();
      map?.remove();
      markerConstructorRef.current = null;

      if (mapRef.current === map) {
        mapRef.current = null;
      }
    };
  }, [apiKey, clearPointers, createMap, createThemeObserver, getThemedStyle, onMapLoad, style]);

  if (!apiKey) {
    return (
      <section
        {...sectionProps}
        className={cn('tw:rounded-md tw:border tw:border-error-border tw:p-4', className)}
        role="alert"
      >
        کلید عمومی نقشه نشان تنظیم نشده است.
      </section>
    );
  }

  return (
    <section
      {...sectionProps}
      className={cn('tw:relative tw:overflow-hidden tw:rounded-md', className)}
    >
      <div ref={containerRef} className="tw:absolute tw:inset-0 tw:size-full" />
      {typeof children === 'function' ? children({ mapCoordinate }) : children}
    </section>
  );
});

NeshanMap.displayName = 'NeshanMap';

export default NeshanMap;
