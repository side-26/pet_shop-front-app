import { act, createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Counter, type CounterRef } from './counter';

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

  it('exposes the latest clamped value through its imperative ref', () => {
    const ref = createRef<CounterRef>();
    const { rerender } = render(<Counter ref={ref} defaultValue={2} min={1} max={3} />);

    expect(ref.current?.value).toBe(2);

    act(() => fireEvent.click(screen.getByRole('button', { name: 'افزایش مقدار' })));
    expect(ref.current?.value).toBe(3);

    rerender(<Counter ref={ref} value={10} min={1} max={3} />);
    expect(ref.current?.value).toBe(3);
  });

  it('uses a stable-size removal action at one when the minimum is zero', () => {
    render(<Counter defaultValue={1} min={0} max={3} variant="outlined" color="success" />);

    const removeButton = screen.getByRole('button', { name: 'حذف مقدار' });
    const classNameBeforeRemoval = removeButton.className;

    expect(removeButton.getAttribute('data-counter-action')).toBe('remove');
    expect(removeButton.querySelector('svg')?.getAttribute('data-counter-icon')).toBe('trash');
    expect(removeButton.querySelector('svg')?.className.baseVal).toContain('tw:text-error');

    fireEvent.click(removeButton);

    const decrementButton = screen.getByRole('button', { name: 'کاهش مقدار' });
    expect(decrementButton.className).toBe(classNameBeforeRemoval);
    expect(decrementButton.getAttribute('data-counter-action')).toBe('decrement');
    expect(decrementButton.querySelector('svg')?.getAttribute('data-counter-icon')).toBe('minus');
  });

  it('uses the current filled-action foreground when error icon contrast is not assured', () => {
    render(<Counter defaultValue={1} min={0} variant="fill" color="success" />);

    const trashIcon = screen.getByRole('button', { name: 'حذف مقدار' }).querySelector('svg');

    expect(trashIcon?.className.baseVal).not.toContain('tw:text-error');
  });

  it('animates value changes directionally without changing the counter controls layout', () => {
    render(<Counter defaultValue={2} min={0} max={4} />);

    const counter = screen.getByRole('group', { name: 'شمارنده' });
    const incrementButton = screen.getByRole('button', { name: 'افزایش مقدار' });
    const decrementButton = screen.getByRole('button', { name: 'کاهش مقدار' });
    const counterClassName = counter.className;
    const incrementClassName = incrementButton.className;
    const decrementClassName = decrementButton.className;

    fireEvent.click(incrementButton);
    expect(screen.getByTestId('counter-value').getAttribute('data-direction')).toBe('increase');

    fireEvent.click(decrementButton);
    expect(screen.getByTestId('counter-value').getAttribute('data-direction')).toBe('decrease');
    expect(counter.className).toBe(counterClassName);
    expect(incrementButton.className).toBe(incrementClassName);
    expect(decrementButton.className).toBe(decrementClassName);
  });
});
