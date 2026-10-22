'use client';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useOrdersDialogs } from './orders-dialog-provider';

export function OrdersRowActions({
  orderId,
  orderNumber,
  disabled = false,
}: Readonly<{
  orderId: string;
  orderNumber: string;
  disabled?: boolean;
}>) {
  const { openDetail } = useOrdersDialogs();

  return (
    <Button
      type="button"
      iconOnly
      size="sm"
      variant="flat"
      color="secondary"
      disabled={disabled}
      onClick={() => openDetail(orderId)}
      aria-label={`مشاهده جزئیات سفارش ${orderNumber}`}
      title="مشاهده جزئیات سفارش"
    >
      <Eye aria-hidden="true" />
    </Button>
  );
}
