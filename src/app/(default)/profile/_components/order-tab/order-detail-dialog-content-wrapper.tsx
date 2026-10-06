'use client';

import { useGetProfileOrder } from '@/entities/profile/profile.client';

import { OrderDetailDialogContentRenderer } from './order-detail-dialog-content-renderer';
import { OrderDetailDialogErrorBoundary } from './order-detail-dialog-error-boundary';
import { OrderDetailDialogSkeleton } from './order-detail-dialog-skeleton';

export function OrderDetailDialogContentWrapper({ orderId }: Readonly<{ orderId: string }>) {
  return (
    <OrderDetailDialogErrorBoundary>
      <OrderDetailDialogContent orderId={orderId} />
    </OrderDetailDialogErrorBoundary>
  );
}

function OrderDetailDialogContent({ orderId }: Readonly<{ orderId: string }>) {
  const { data: order, error, isPending } = useGetProfileOrder(orderId);

  if (error) throw error;
  if (isPending || !order) return <OrderDetailDialogSkeleton />;

  return <OrderDetailDialogContentRenderer order={order} />;
}
