import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import CartError from './error';

const { retryCartActionMock } = vi.hoisted(() => ({ retryCartActionMock: vi.fn() }));

vi.mock('@/entities/users/users.actions', () => ({ retryCartAction: retryCartActionMock }));

afterEach(() => {
  vi.restoreAllMocks();
});

it('expires the cart cache before retrying the route', async () => {
  const retry = vi.fn();
  retryCartActionMock.mockResolvedValue(undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);

  render(<CartError error={new Error('اتصال به سبد خرید برقرار نشد')} retry={retry} />);

  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByText('بارگذاری سبد خرید انجام نشد')).toBeTruthy();
  expect(screen.getByText('اتصال به سبد خرید برقرار نشد')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));

  await waitFor(() => {
    expect(retryCartActionMock).toHaveBeenCalledOnce();
    expect(retry).toHaveBeenCalledOnce();
  });
});
