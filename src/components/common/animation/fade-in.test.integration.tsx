import { lazy } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FadeIn } from './fade-in';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('FadeIn', () => {
  it('reveals eagerly without creating an intersection observer', () => {
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrame);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const intersectionObserver = vi.fn();
    vi.stubGlobal('IntersectionObserver', intersectionObserver);

    render(<FadeIn loading="eager">محتوای اولیه</FadeIn>);

    expect(screen.getByText('محتوای اولیه').getAttribute('data-reveal-in-view')).toBe('true');
    expect(intersectionObserver).not.toHaveBeenCalled();
  });

  it('loads and reveals the lazy component after it intersects with the default root margin', async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let intersectionObserverCallback: IntersectionObserverCallback | undefined;
    const intersectionObserver = vi.fn(function (callback: IntersectionObserverCallback) {
      intersectionObserverCallback = callback;
      return { disconnect, observe };
    });
    vi.stubGlobal('IntersectionObserver', intersectionObserver);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const LazyContent = lazy(async () => ({
      default: () => <p>محتوای با تأخیر</p>,
    }));

    render(<FadeIn loading="lazy" dynamicPromiseComponent={LazyContent} />);

    expect(intersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      rootMargin: '200px',
      threshold: 0.2,
    });
    await act(async () => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(await screen.findByText('محتوای با تأخیر')).toBeTruthy();
    expect(
      screen.getByText('محتوای با تأخیر').parentElement?.getAttribute('data-reveal-in-view'),
    ).toBe('true');
    expect(observe).toHaveBeenCalledWith(screen.getByText('محتوای با تأخیر').parentElement);
  });
});
