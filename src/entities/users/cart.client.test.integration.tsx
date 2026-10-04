import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCartCheckoutAction } from './users.actions';
import { useCartCheckout } from './cart.client';

vi.mock('./users.actions', () => ({ getCartCheckoutAction: vi.fn() }));

const getCartCheckoutActionMock = vi.mocked(getCartCheckoutAction);

function wrapper({ children }: Readonly<{ children: ReactNode }>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
}

describe('useCartCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the checkout Server Action and immediately discards an unused result', async () => {
    const input = {
      addressId: '507f1f77bcf86cd799439011',
      deliveryServiceId: '507f1f77bcf86cd799439012',
    };
    getCartCheckoutActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {
        itemsPrice: 200_000,
        packingPrice: 10_000,
        discountPrice: 20_000,
        shippingPrice: 30_000,
        payableAmount: 220_000,
      },
    } as never);

    const { result } = renderHook(() => useCartCheckout(input), { wrapper });

    await waitFor(() => expect(result.current.data?.payableAmount).toBe(220_000));
    expect(getCartCheckoutActionMock).toHaveBeenCalledWith(input);
  });
});
