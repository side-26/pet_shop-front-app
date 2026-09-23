import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveMapStyleCssVariables, type MapStyle } from './style-css-variables';

afterEach(() => vi.restoreAllMocks());

describe('resolveMapStyleCssVariables', () => {
  it('resolves shared semantic CSS variables once without changing map-specific colors', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      color: 'lab(42 10 -30)',
    } as CSSStyleDeclaration);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: vi.fn(),
      getImageData: () => ({ data: Uint8ClampedArray.from([11, 102, 193, 255]) }),
    } as unknown as CanvasRenderingContext2D);
    const style = {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': 'var(--background)' },
        },
        {
          id: 'water',
          type: 'fill',
          source: 'composite',
          'source-layer': 'water',
          paint: { 'fill-color': '#031930' },
        },
      ],
    };

    const resolvedStyle = resolveMapStyleCssVariables(
      style as unknown as MapStyle,
    ) as unknown as typeof style;

    expect(resolvedStyle.layers[0].paint['background-color']).toBe('rgb(11, 102, 193)');
    expect(resolvedStyle.layers[1].paint['fill-color']).toBe('#031930');
    expect(style.layers[0].paint['background-color']).toBe('var(--background)');
    expect(window.getComputedStyle).toHaveBeenCalledTimes(1);
  });
});
