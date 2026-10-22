'use client';

import { createContext, use } from 'react';

import type { OrdersDetailDialogParams } from './orders-detail-dialog.types';

export const OrdersDetailDialogParamsContext = createContext<OrdersDetailDialogParams | null>(null);

export function useOrdersDetailDialogParams() {
  const params = use(OrdersDetailDialogParamsContext);
  if (!params) throw new Error('Missing OrdersDetailDialogParamsContext');
  return params;
}
