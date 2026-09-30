'use client';

import { useEffect } from 'react';

import { useCheckoutStore } from '@/stores/checkout.store';
import type { CartPrices } from '@/entities/cart/cart.helper';

export function CheckoutCartPriceSynchronizer({ prices }: Readonly<{ prices: CartPrices }>) {
  const setCartPrices = useCheckoutStore((state) => state.setCartPrices);

  useEffect(() => {
    setCartPrices(prices);
  }, [prices, setCartPrices]);

  return null;
}
