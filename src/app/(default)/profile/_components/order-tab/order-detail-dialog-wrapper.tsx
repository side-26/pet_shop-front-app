'use client';

import dynamic from 'next/dynamic';
import { Suspense, forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import type { DialogHandle } from '@/_types';

import type { OrderDetailDialogProps } from './order-detail-dialog';
import { OrderDetailDialogSkeleton } from './order-detail-dialog-skeleton';

const LazyOrderDetailDialog = dynamic<OrderDetailDialogProps>(() =>
  import('./order-detail-dialog').then((module) => module.OrderDetailDialog),
);

export type OrderDetailDialogParams = Readonly<{ orderId: string }>;
export type OrderDetailDialogRef = DialogHandle<OrderDetailDialogParams>;

export const OrderDetailDialogWrapper = forwardRef<OrderDetailDialogRef>(
  function OrderDetailDialogWrapper(_props, ref) {
    const [orderId, setOrderId] = useState<string | null>(null);
    const close = useCallback(() => setOrderId(null), []);
    const open = useCallback(
      ({ orderId: nextOrderId }: OrderDetailDialogParams) => setOrderId(nextOrderId),
      [],
    );

    useImperativeHandle(ref, () => ({ close, open }), [close, open]);

    return orderId ? (
      <Suspense fallback={<OrderDetailDialogSkeleton />}>
        <LazyOrderDetailDialog onClose={close} orderId={orderId} />
      </Suspense>
    ) : null;
  },
);
