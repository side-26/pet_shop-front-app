import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { defaultMobileViewportLimit, useDetectMobileViewport } from './use-detect-mobile-viewport';

type MatchMediaController = {
  emitChange: (matches: boolean) => void;
  matchMedia: ReturnType<typeof vi.fn>;
};

function mockMatchMedia(initialMatches = false): MatchMediaController {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const queryList = {
    addEventListener: vi.fn((_: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    }),
    matches,
    media: '',
    removeEventListener: vi.fn((_: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    }),
  } as unknown as MediaQueryList;
  const matchMedia = vi.fn((media: string) => {
    Object.defineProperties(queryList, {
      matches: { configurable: true, value: matches },
      media: { configurable: true, value: media },
    });
    return queryList;
  });

  vi.stubGlobal('matchMedia', matchMedia);

  return {
    matchMedia,
    emitChange(nextMatches) {
      matches = nextMatches;
      Object.defineProperty(queryList, 'matches', { configurable: true, value: matches });
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    },
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('useDetectMobileViewport', () => {
  it('uses the 1023px mobile/tablet limit by default and reacts to viewport changes', () => {
    const media = mockMatchMedia(true);
    const { result } = renderHook(() => useDetectMobileViewport());

    expect(result.current).toBe(true);
    expect(media.matchMedia).toHaveBeenCalledWith(`(max-width: ${defaultMobileViewportLimit}px)`);

    act(() => media.emitChange(false));
    expect(result.current).toBe(false);
  });

  it('accepts a custom desktop threshold', () => {
    const media = mockMatchMedia(false);
    renderHook(() => useDetectMobileViewport(767));

    expect(media.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });
});
