import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { mapPluginPositions } from '@/entities/map/map.dto';

import { NeshanMapPluginWrapper } from './plugin-wrapper';

afterEach(cleanup);

describe('NeshanMapPluginWrapper', () => {
  it.each([
    ['top-right', ['tw:top-3', 'tw:right-3']],
    ['top-left', ['tw:top-3', 'tw:left-3']],
    ['bottom-left', ['tw:bottom-3', 'tw:left-3']],
    ['bottom-right', ['tw:bottom-3', 'tw:right-3']],
  ] as const)('positions plugins at %s with the standard map inset', (position, classes) => {
    render(
      <NeshanMapPluginWrapper position={position} data-testid="map-plugin-wrapper">
        <button type="button">کنترل نقشه</button>
      </NeshanMapPluginWrapper>,
    );

    const wrapper = screen.getByTestId('map-plugin-wrapper');

    expect(mapPluginPositions).toContain(position);
    expect(wrapper.getAttribute('class')).toContain('tw:absolute');
    expect(wrapper.getAttribute('class')).toContain('tw:flex-col');
    expect(wrapper.getAttribute('class')).toContain('tw:gap-2');
    for (const className of classes) {
      expect(wrapper.getAttribute('class')).toContain(className);
    }
  });

  it('defaults to the top-left corner and merges custom classes', () => {
    render(<NeshanMapPluginWrapper className="tw:items-end" data-testid="map-plugin-wrapper" />);

    const wrapper = screen.getByTestId('map-plugin-wrapper');

    expect(wrapper.getAttribute('class')).toContain('tw:top-3');
    expect(wrapper.getAttribute('class')).toContain('tw:left-3');
    expect(wrapper.getAttribute('class')).toContain('tw:items-end');
  });
});
