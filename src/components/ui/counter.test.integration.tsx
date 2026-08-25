import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Counter } from './counter';

afterEach(cleanup);

describe('Counter', () => {
  it('uses the default value and enforces its minimum and maximum', () => {
    const onValueChange = vi.fn();
    render(<Counter defaultValue={2} min={1} max={3} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'افزایش مقدار' }));
    expect(screen.getByText('۳')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزایش مقدار' }).hasAttribute('disabled')).toBe(
      true,
    );

    fireEvent.click(screen.getByRole('button', { name: 'کاهش مقدار' }));
    fireEvent.click(screen.getByRole('button', { name: 'کاهش مقدار' }));
    expect(screen.getByText('۱')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'کاهش مقدار' }).hasAttribute('disabled')).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it('clamps values and exposes visual axes', () => {
    const { rerender } = render(
      <Counter defaultValue={20} min={2} max={5} variant="tonal" color="success" size="xl" />,
    );
    const counter = screen.getByRole('group', { name: 'شمارنده' });

    expect(screen.getByText('۵')).toBeTruthy();
    expect(counter.getAttribute('data-variant')).toBe('tonal');
    expect(counter.getAttribute('data-color')).toBe('success');
    expect(counter.getAttribute('data-size')).toBe('xl');

    rerender(<Counter value={-10} min={2} max={5} />);
    expect(screen.getByText('۲')).toBeTruthy();
  });
});
