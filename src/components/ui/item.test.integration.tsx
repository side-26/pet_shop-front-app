import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  itemVariants,
} from './item';

describe('Item', () => {
  it('provides the compact default list-row treatment', () => {
    render(
      <Item>
        <ItemMedia>تصویر</ItemMedia>
        <ItemContent>
          <ItemTitle>آیتم نمونه</ItemTitle>
        </ItemContent>
        <ItemActions>عملیات</ItemActions>
      </Item>,
    );

    const item = screen.getByText('آیتم نمونه').parentElement?.parentElement;
    expect(item?.getAttribute('data-slot')).toBe('item');
    expect(item?.className).toContain('tw:hover:bg-muted');
    expect(screen.getByText('آیتم نمونه').tagName).toBe('H3');
  });

  it('provides a semantic list container for Item list items', () => {
    render(
      <ItemGroup aria-label="پیشنهادها">
        <Item render={<li />}>آیتم</Item>
      </ItemGroup>,
    );

    expect(screen.getByRole('list', { name: 'پیشنهادها' })).toBeTruthy();
    expect(screen.getByRole('listitem')).toBeTruthy();
  });

  it.each([
    ['tonal', 'success', 'tw:bg-success-muted'],
    ['fill', 'error', 'tw:bg-error'],
    ['glassy', 'primary', 'tw:supports-backdrop-filter:backdrop-blur-xl'],
  ] as const)('resolves the %s %s surface', (variant, color, expectedClass) => {
    expect(itemVariants({ variant, color })).toContain(expectedClass);
  });
});
