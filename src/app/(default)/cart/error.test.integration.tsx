import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import CartError from './error';

afterEach(() => {
  vi.restoreAllMocks();
});

it('renders the cart error message and retries the route', () => {
  const retry = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);

  render(<CartError error={new Error('اتصال به سبد خرید برقرار نشد')} retry={retry} />);

  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByText('بارگذاری سبد خرید انجام نشد')).toBeTruthy();
  expect(screen.getByText('اتصال به سبد خرید برقرار نشد')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));

  expect(retry).toHaveBeenCalledOnce();
});
