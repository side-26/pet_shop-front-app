'use client';

import { createContext, useContext } from 'react';

import type { CheckoutDeliveryAvailability } from '@/stores/checkout.store';

export const DeliveryTimeDayContext = createContext<CheckoutDeliveryAvailability | null>(null);

export function useDeliveryTimeDay() {
  const day = useContext(DeliveryTimeDayContext);
  if (!day) throw new Error('DeliveryTimeDayItem must be rendered within DeliveryTimeDayContext.');
  return day;
}
