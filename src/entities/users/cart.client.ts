'use client';

import { useQuery } from '@tanstack/react-query';

import { getCartCheckoutAction } from './users.actions';
import type { CartCheckoutDTO, CartCheckoutQueryDTO } from './users.dto';

export const cartQueryKeys = {
  checkout: (input: CartCheckoutQueryDTO) =>
    ['cart', 'checkout', input.addressId, input.deliveryServiceId] as const,
};

export class CartCheckoutQueryError extends Error {
  constructor(message: string | null) {
    super(message ?? 'محاسبه مبلغ سفارش انجام نشد.');
    this.name = 'CartCheckoutQueryError';
  }
}

/** Queries the server-calculated checkout amount without retaining stale totals. */
export function useCartCheckout(input: CartCheckoutQueryDTO | null) {
  return useQuery<CartCheckoutDTO>({
    queryKey: input ? cartQueryKeys.checkout(input) : (['cart', 'checkout', 'unselected'] as const),
    queryFn: async () => {
      if (!input) throw new CartCheckoutQueryError(null);
      const result = await getCartCheckoutAction(input);
      if (!result.isSuccess) throw new CartCheckoutQueryError(result.message);
      return result.data;
    },
    enabled: input !== null,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
