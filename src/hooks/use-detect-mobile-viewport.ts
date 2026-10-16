'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

export const defaultMobileViewportLimit = 1023;

function normalizeViewportLimit(limit: number) {
  return Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : defaultMobileViewportLimit;
}

/**
 * Reports whether the viewport belongs to the mobile/tablet range.
 * The desktop range begins one pixel above `desktopViewportLimit`.
 */
export function useDetectMobileViewport(desktopViewportLimit = defaultMobileViewportLimit) {
  const mediaQuery = useMemo(
    () => `(max-width: ${normalizeViewportLimit(desktopViewportLimit)}px)`,
    [desktopViewportLimit],
  );
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => undefined;
      }

      const queryList = window.matchMedia(mediaQuery);
      queryList.addEventListener('change', onStoreChange);

      return () => queryList.removeEventListener('change', onStoreChange);
    },
    [mediaQuery],
  );
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(mediaQuery).matches;
  }, [mediaQuery]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
