'use client';

import dynamic from 'next/dynamic';
import { Suspense, useCallback, useImperativeHandle, useState, type Ref } from 'react';

import type { OrderDetailDialogProps } from './order-detail-dialog';
import { OrderDetailDialogSkeleton } from './order-detail-dialog-skeleton';

const LazyOrderDetailDialog = dynamic<OrderDetailDialogProps>(() =>
  import('./order-detail-dialog').then((module) => module.OrderDetailDialog),
);

export type OrderDetailDialogRef = {
  close: () => void;
  open: (orderId: string) => void;
};

type OrderDetailDialogWrapperProps = Readonly<{ ref: Ref<OrderDetailDialogRef> }>;

export function OrderDetailDialogWrapper({ ref }: OrderDetailDialogWrapperProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const close = useCallback(() => setOrderId(null), []);
  const open = useCallback((nextOrderId: string) => setOrderId(nextOrderId), []);

  useImperativeHandle(ref, () => ({ close, open }), [close, open]);

  return orderId ? (
    <Suspense fallback={<OrderDetailDialogSkeleton />}>
      <LazyOrderDetailDialog onClose={close} orderId={orderId} />
    </Suspense>
  ) : null;
}
