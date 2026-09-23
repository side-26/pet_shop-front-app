import { createRef } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NeshanMap, type NeshanMapHandle } from './default';

const { mapConstructor, remove, flyTo, setStyle } = vi.hoisted(() => ({
  flyTo: vi.fn(),
  remove: vi.fn(),
  setStyle: vi.fn(),
  mapConstructor: vi.fn(),
}));

vi.mock('@neshan-maps-platform/maplibre-sdk', () => ({
  default: {
    Map: class MockMap {
      constructor(options: unknown) {
        mapConstructor(options);
        return { flyTo, remove, setStyle };
      }
    },
  },
}));

vi.mock('@neshan-maps-platform/maplibre-sdk/style.css', () => ({}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.documentElement.classList.remove('dark');
});

describe('NeshanMap', () => {
  it('initializes the SDK with typed map options and exposes the map commands through its ref', async () => {
    const onMapLoad = vi.fn();
    const ref = createRef<NeshanMapHandle>();

    const { unmount } = render(
      <NeshanMap
        ref={ref}
        apiKey="public-key"
        center={[51.389, 35.6892]}
        zoom={14}
        style="https://example.test/style.json"
        aria-label="نقشه فروشگاه"
        onMapLoad={onMapLoad}
      >
        <span>پوشش نقشه</span>
      </NeshanMap>,
    );

    await waitFor(() => expect(mapConstructor).toHaveBeenCalledTimes(1));
    expect(mapConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'public-key',
        center: [51.389, 35.6892],
        style: 'https://example.test/style.json',
        zoom: 14,
      }),
    );
    expect(screen.getByRole('region', { name: 'نقشه فروشگاه' })).toBeTruthy();
    expect(screen.getByText('پوشش نقشه')).toBeTruthy();
    expect(onMapLoad).toHaveBeenCalledTimes(1);

    ref.current?.flyTo([51.4, 35.7]);
    expect(flyTo).toHaveBeenCalledWith({ center: [51.4, 35.7] });
    expect(ref.current?.getMap()).toEqual(expect.objectContaining({ flyTo, remove }));

    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('renders an accessible configuration error without constructing a map when no API key is available', () => {
    render(<NeshanMap apiKey="" />);

    expect(screen.getByRole('alert').textContent).toContain('کلید عمومی نقشه نشان تنظیم نشده است.');
    expect(mapConstructor).not.toHaveBeenCalled();
  });

  it('uses the resolved application theme and swaps styles without recreating the map', async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const themeObserverDisconnect = vi.fn();
    let onThemeClassChange: MutationCallback | undefined;

    vi.stubGlobal(
      'MutationObserver',
      class MutationObserver {
        constructor(callback: MutationCallback) {
          this.callback = callback;
        }

        callback: MutationCallback;
        isThemeObserver = false;

        observe = (target: Node, options?: MutationObserverInit) => {
          observe(target, options);

          if (target === document.documentElement && options?.attributeFilter?.includes('class')) {
            this.isThemeObserver = true;
            onThemeClassChange = this.callback;
          }
        };
        disconnect = () => {
          disconnect();

          if (this.isThemeObserver) {
            themeObserverDisconnect();
          }
        };
        takeRecords = vi.fn();
      },
    );
    document.documentElement.classList.add('dark');

    const { unmount } = render(<NeshanMap apiKey="public-key" />);

    await waitFor(() => expect(mapConstructor).toHaveBeenCalledTimes(1));
    expect(mapConstructor.mock.calls[0][0].style.name).toBe('Pet Shop Dark');
    await waitFor(() => expect(onThemeClassChange).toBeDefined());

    document.documentElement.classList.remove('dark');
    onThemeClassChange?.([], {} as MutationObserver);

    await waitFor(() => expect(setStyle).toHaveBeenCalledTimes(1));
    expect(setStyle.mock.calls[0][0].name).toBe('Pet Shop Light');

    unmount();
    expect(themeObserverDisconnect).toHaveBeenCalledTimes(1);
    expect(mapConstructor).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
