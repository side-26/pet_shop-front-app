import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

afterEach(cleanup);

describe('Toggle and ToggleGroup', () => {
  it('exposes the shared visual axes and standalone pressed state', () => {
    render(
      <Toggle aria-label="علاقه‌مندی" defaultPressed color="error" variant="tonal" size="lg">
        پسندیدن
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'علاقه‌مندی' });
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(toggle.getAttribute('data-color')).toBe('error');
    expect(toggle.getAttribute('data-variant')).toBe('tonal');
    expect(toggle.getAttribute('data-size')).toBe('lg');
  });

  it('uses Base UI array values for single selection', () => {
    const onValueChange = vi.fn();

    render(
      <DirectionProvider direction="rtl">
        <ToggleGroup aria-label="انتخاب وزن" defaultValue={['15kg']} onValueChange={onValueChange}>
          <ToggleGroupItem value="15kg">۱۵ کیلوگرم</ToggleGroupItem>
          <ToggleGroupItem value="4kg">۴ کیلوگرم</ToggleGroupItem>
        </ToggleGroup>
      </DirectionProvider>,
    );

    expect(screen.getByRole('button', { name: '۱۵ کیلوگرم' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('group', { name: 'انتخاب وزن' }).getAttribute('data-variant')).toBe(
      'flat',
    );
    expect(screen.getByRole('button', { name: '۱۵ کیلوگرم' }).getAttribute('data-variant')).toBe(
      'flat',
    );
    fireEvent.click(screen.getByRole('button', { name: '۴ کیلوگرم' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['4kg'], expect.anything());
  });

  it('supports multiple selection, orientation, joined spacing, and disabled items', () => {
    render(
      <ToggleGroup
        multiple
        aria-label="ویژگی‌ها"
        defaultValue={['grain-free']}
        orientation="vertical"
        spacing={0}
        color="success"
        size="sm"
      >
        <ToggleGroupItem value="grain-free">بدون غلات</ToggleGroupItem>
        <ToggleGroupItem value="sensitive" disabled>
          حساس
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole('group', { name: 'ویژگی‌ها' });
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.getAttribute('data-spacing')).toBe('0');
    expect(screen.getByRole('button', { name: 'بدون غلات' }).getAttribute('data-color')).toBe(
      'success',
    );
    expect(screen.getByRole('button', { name: 'حساس' }).hasAttribute('disabled')).toBe(true);
  });
});
