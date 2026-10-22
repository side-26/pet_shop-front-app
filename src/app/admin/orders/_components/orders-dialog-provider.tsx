'use client';

import { createContext, use, useMemo, useRef, type ReactNode } from 'react';

import { useDialogController } from '@/hooks/use-dialog-controller';

import { OrdersFilterDialog, type OrdersFilterDialogHandle } from './orders-filter-dialog';
import { OrdersDetailDialogWrapper } from './orders-detail-dialog-wrapper';
import type { OrdersDetailDialogHandle } from './orders-detail-dialog.types';

type OrdersDialogActions = Readonly<{
  openFilter: (query: Record<string, string>) => void;
  openDetail: (orderId: string) => void;
}>;

const OrdersDialogContext = createContext<OrdersDialogActions | null>(null);

export function useOrdersDialogs() {
  const context = use(OrdersDialogContext);

  if (!context) throw new Error('Missing OrdersDialogProvider');

  return context;
}

export function OrdersDialogProvider({ children }: Readonly<{ children: ReactNode }>) {
  const filterDialogRef = useRef<OrdersFilterDialogHandle>(null);
  const detailDialogRef = useRef<OrdersDetailDialogHandle>(null);
  const { open } = useDialogController(
    useMemo(() => ({ filter: { ref: filterDialogRef }, detail: { ref: detailDialogRef } }), []),
  );
  const actions = useMemo<OrdersDialogActions>(
    () => ({
      openFilter: (query) => open('filter', { query }),
      openDetail: (orderId) => open('detail', { orderId }),
    }),
    [open],
  );

  return (
    <OrdersDialogContext value={actions}>
      {children}
      <OrdersFilterDialog ref={filterDialogRef} />
      <OrdersDetailDialogWrapper ref={detailDialogRef} />
    </OrdersDialogContext>
  );
}
