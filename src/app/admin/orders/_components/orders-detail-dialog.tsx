'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrdersDetailDialogContent } from './orders-detail-dialog-content';

type OrdersDetailDialogProps = Readonly<{
  onExitComplete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>;

export default function OrdersDetailDialog({
  onExitComplete,
  onOpenChange,
  open,
}: OrdersDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        showCloseButton={false}
        className="tw:flex tw:max-h-[calc(100svh-2rem)] tw:flex-col tw:gap-0 tw:overflow-hidden tw:p-0"
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !open) onExitComplete();
        }}
      >
        <DialogHeader className="tw:flex-none tw:border-b tw:border-border tw:px-6 tw:py-4">
          <div className="tw:flex tw:items-center tw:justify-between">
            <DialogTitle>جزئیات سفارش</DialogTitle>
            <DialogClose
              aria-label="بستن جزئیات سفارش"
              render={<Button iconOnly size="sm" variant="flat" color="secondary" />}
            >
              <X />
            </DialogClose>
          </div>
        </DialogHeader>
        <OrdersDetailDialogContent />
      </DialogContent>
    </Dialog>
  );
}
