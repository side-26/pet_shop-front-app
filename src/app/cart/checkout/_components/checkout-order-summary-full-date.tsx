'use client';

import { CalendarDays } from 'lucide-react';

import { useCheckoutStore } from '@/stores/checkout.store';

export function CheckoutOrderSummaryFullDate() {
  const selectedDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const selectedTimeSlot = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);

  return (
    <div className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-muted tw:p-3">
      <CalendarDays
        aria-hidden="true"
        className="tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-primary"
      />
      <p className="tw:text-body-s tw:text-muted-foreground">
        تحویل {selectedDate?.weekday}، ساعت <bdi>{selectedTimeSlot?.label}</bdi>
      </p>
    </div>
  );
}
