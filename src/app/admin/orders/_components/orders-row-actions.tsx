'use client';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function OrdersRowActions({
  orderNumber,
  disabled = false,
}: Readonly<{
  orderNumber: string;
  disabled?: boolean;
}>) {
  return (
    <Button
      type="button"
      iconOnly
      size="sm"
      variant="flat"
      color="secondary"
      disabled={disabled}
      aria-label={`مشاهده جزئیات سفارش ${orderNumber}`}
      title="جزئیات سفارش به‌زودی اضافه می‌شود"
    >
      <Eye aria-hidden="true" />
    </Button>
  );
}
