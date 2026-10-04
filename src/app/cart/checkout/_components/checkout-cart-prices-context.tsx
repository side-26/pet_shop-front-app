'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useCartCheckout } from '@/entities/users/cart.client';
import type { CartCheckoutDTO } from '@/entities/users/users.dto';
import { useCheckoutStore } from '@/stores/checkout.store';

type CheckoutCartPricesContextValue = Readonly<{
  prices: CartCheckoutDTO | null;
  isLoading: boolean;
}>;

const CheckoutCartPricesContext = createContext<CheckoutCartPricesContextValue | null>(null);

export function CheckoutCartPricesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const addressId = useCheckoutStore((state) => state.checkoutInformation.addressId);
  const deliveryServiceId = useCheckoutStore(
    (state) => state.checkoutInformation.deliveryServiceId,
  );
  const input = addressId && deliveryServiceId ? { addressId, deliveryServiceId } : null;
  const query = useCartCheckout(input);
  const value: CheckoutCartPricesContextValue = {
    prices: query.data ?? null,
    isLoading: input !== null && query.isFetching,
  };

  return (
    <CheckoutCartPricesContext.Provider value={value}>
      {children}
    </CheckoutCartPricesContext.Provider>
  );
}

export function useCheckoutCartPrices() {
  const context = useContext(CheckoutCartPricesContext);
  if (!context) {
    throw new Error('useCheckoutCartPrices must be used within CheckoutCartPricesProvider.');
  }
  return context;
}
