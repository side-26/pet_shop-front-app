import type { NeshanMapOptions } from '@neshan-maps-platform/maplibre-sdk';

export type MapStyle = NonNullable<NeshanMapOptions['style']>;

const CSS_VARIABLE_PATTERN = /^var\((--[\w-]+)\)$/;

function toMapLibreColor(cssColor: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    return cssColor;
  }

  context.fillStyle = cssColor;
  context.fillRect(0, 0, 1, 1);

  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;

  return alpha === 255
    ? `rgb(${red}, ${green}, ${blue})`
    : `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
}

function getComputedCssColor(variableName: string, cache: Map<string, string>) {
  const cachedColor = cache.get(variableName);

  if (cachedColor) {
    return cachedColor;
  }

  const colorProbe = document.createElement('span');
  colorProbe.style.color = `var(${variableName})`;
  colorProbe.setAttribute('aria-hidden', 'true');
  document.documentElement.append(colorProbe);

  const color = toMapLibreColor(getComputedStyle(colorProbe).color);
  colorProbe.remove();
  cache.set(variableName, color);

  return color;
}

export function resolveMapStyleCssVariables(style: MapStyle): MapStyle {
  if (typeof style === 'string') {
    return style;
  }

  const colorCache = new Map<string, string>();
  const resolveValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      const variableName = value.match(CSS_VARIABLE_PATTERN)?.[1];

      return variableName ? getComputedCssColor(variableName, colorCache) : value;
    }

    if (Array.isArray(value)) {
      return value.map(resolveValue);
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => [key, resolveValue(nestedValue)]),
      );
    }

    return value;
  };

  return resolveValue(style) as MapStyle;
}
