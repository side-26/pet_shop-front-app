'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderDetailDialogContentWrapper } from './order-detail-dialog-content-wrapper';

export type OrderDetailDialogProps = Readonly<{
  onClose: () => void;
  orderId: string;
}>;

export function OrderDetailDialog({ onClose, orderId }: OrderDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      {isOpen ? (
        <DialogContent
          showCloseButton={false}
          size="xl"
          className="tw:flex tw:max-h-[calc(100svh-2rem)] tw:flex-col tw:gap-0 tw:overflow-hidden tw:p-0"
        >
          <DialogHeader className="tw:flex-none tw:border-b tw:border-border tw:px-6 tw:py-4">
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
              <DialogTitle>جزئیات سفارش</DialogTitle>
              <DialogClose
                aria-label="بستن جزئیات سفارش"
                render={<Button iconOnly size="sm" variant="flat" color="secondary" />}
              >
                <X />
              </DialogClose>
            </div>
          </DialogHeader>
          <main className="tw:flex-auto tw:overflow-auto" data-order-id={orderId}>
            <OrderDetailDialogContentWrapper orderId={orderId} />
          </main>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
