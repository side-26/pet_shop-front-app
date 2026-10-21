'use client';

import { createContext, use, useMemo, useRef, type ReactNode } from 'react';

import { useDialogController } from '@/hooks/use-dialog-controller';

import { OrdersFilterDialog, type OrdersFilterDialogHandle } from './orders-filter-dialog';

type OrdersDialogActions = Readonly<{
  openFilter: (query: Record<string, string>) => void;
}>;

const OrdersDialogContext = createContext<OrdersDialogActions | null>(null);

export function useOrdersDialogs() {
  const context = use(OrdersDialogContext);

  if (!context) throw new Error('Missing OrdersDialogProvider');

  return context;
}

export function OrdersDialogProvider({ children }: Readonly<{ children: ReactNode }>) {
  const filterDialogRef = useRef<OrdersFilterDialogHandle>(null);
  const { open } = useDialogController(useMemo(() => ({ filter: { ref: filterDialogRef } }), []));
  const actions = useMemo<OrdersDialogActions>(
    () => ({ openFilter: (query) => open('filter', { query }) }),
    [open],
  );

  return (
    <OrdersDialogContext value={actions}>
      {children}
      <OrdersFilterDialog ref={filterDialogRef} />
    </OrdersDialogContext>
  );
}
