import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NeshanMapPointerIcon } from './pointer';

describe('NeshanMapPointerIcon', () => {
  it.each([
    ['xs', 'tw:size-5'],
    ['sm', 'tw:size-6'],
    ['md', 'tw:size-8'],
    ['lg', 'tw:size-10'],
    ['xl', 'tw:size-12'],
  ] as const)('renders the primary %s marker size', (size, sizeClass) => {
    render(<NeshanMapPointerIcon.Root size={size} aria-label={`مکان ${size}`} />);

    const icon = screen.getByRole('img', { name: `مکان ${size}` });

    expect(icon.getAttribute('class')).toContain('tw:text-primary');
    expect(icon.getAttribute('class')).toContain(sizeClass);
    expect(icon.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
    expect(icon.querySelector('circle')?.getAttribute('class')).toContain(
      'tw:fill-primary-foreground',
    );
  });

  it('allows explicit compound composition and defaults to the medium size', () => {
    render(
      <NeshanMapPointerIcon.Root aria-label="مکان انتخاب‌شده">
        <NeshanMapPointerIcon.Pin data-part="pin" />
        <NeshanMapPointerIcon.Center data-part="center" />
      </NeshanMapPointerIcon.Root>,
    );

    const icon = screen.getByRole('img', { name: 'مکان انتخاب‌شده' });

    expect(icon.getAttribute('class')).toContain('tw:size-8');
    expect(icon.querySelector('[data-part="pin"]')).toBeTruthy();
    expect(icon.querySelector('[data-part="center"]')).toBeTruthy();
  });
});
