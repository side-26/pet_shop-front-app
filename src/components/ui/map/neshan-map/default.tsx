'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import {
  type Map as NeshanMapInstance,
  type NeshanMapOptions,
} from '@neshan-maps-platform/maplibre-sdk';
import '@neshan-maps-platform/maplibre-sdk/style.css';

import { cn } from '@/lib/utils';

const DEFAULT_CENTER = [51.389, 35.6892] as const;
type MapStyle = NonNullable<NeshanMapOptions['style']>;

export type NeshanMapCoordinates = readonly [longitude: number, latitude: number];

export type NeshanMapHandle = Readonly<{
  flyTo: (
    center: NeshanMapCoordinates,
    options?: Omit<Parameters<NeshanMapInstance['flyTo']>[0], 'center'>,
  ) => void;
  getMap: () => NeshanMapInstance | null;
}>;

export type NeshanMapProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> &
  Readonly<{
    apiKey?: string;
    center?: NeshanMapCoordinates;
    zoom?: number;
    /** A fixed MapLibre style. When provided, it takes precedence over the themed styles. */
    style?: MapStyle;
    lightStyle?: MapStyle;
    darkStyle?: MapStyle;
    children?: ReactNode;
    onMapLoad?: (map: NeshanMapInstance) => void;
  }>;

export const NeshanMap = forwardRef<NeshanMapHandle, NeshanMapProps>(function NeshanMap(
  {
    apiKey = process.env.NEXT_PUBLIC_NESHAN_API_KEY,
    center = DEFAULT_CENTER,
    zoom = 12,
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

      return new maplibregl.Map({
        apiKey,
        center: [...center],
        container,
        style: mapStyle,
        zoom,
      });
    },
    [apiKey, center, zoom],
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
            map.setStyle(nextStyle);
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
      getMap: () => mapRef.current,
    }),
    [],
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
      const initialStyle = style ?? (await getThemedStyle(initialIsDark));
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
      map?.remove();

      if (mapRef.current === map) {
        mapRef.current = null;
      }
    };
  }, [apiKey, createMap, createThemeObserver, getThemedStyle, onMapLoad, style]);

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
      {children}
    </section>
  );
});

NeshanMap.displayName = 'NeshanMap';

export default NeshanMap;
