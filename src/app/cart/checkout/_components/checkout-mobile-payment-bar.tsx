'use client';

import { CalendarDays } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { useCheckoutStore } from '@/stores/checkout.store';

export function CheckoutMobilePaymentBar() {
  const payablePrice = useCheckoutStore((state) => state.prices.payablePrice);
  const deliveryDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const deliveryTimeSlot = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);
  const canPay = Boolean(deliveryTimeSlot?.id);

  return (
    <footer
      aria-label="پرداخت سفارش"
      className="tw:fixed tw:inset-x-0 tw:bottom-0 tw:z-30 tw:mx-auto tw:w-full tw:max-w-3xl tw:p-2 tw:pb-[max(0.5rem,env(safe-area-inset-bottom))] tw:sm:p-3 tw:sm:pb-3 tw:lg:hidden"
    >
      <Card variant="glass" size="sm" className="tw:shadow-2xl tw:shadow-foreground/15">
        <CardHeader className="tw:flex tw:flex-row tw:items-center tw:justify-between tw:gap-3">
          <span className="tw:text-label-s tw:text-muted-foreground">مبلغ قابل پرداخت</span>
          <Price number={payablePrice} className="tw:text-price-m tw:text-primary" />
        </CardHeader>
        <CardFooter className="tw:flex-nowrap tw:justify-between tw:gap-3">
          <div className="tw:flex tw:flex-none tw:items-start tw:gap-2">
            <CalendarDays
              aria-hidden="true"
              className="tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-primary"
            />
            <div className="tw:flex tw:flex-col tw:gap-0.5">
              <span className="tw:text-label-s tw:text-muted-foreground">زمان تحویل</span>
              {deliveryTimeSlot?.id ? (
                <span className="tw:text-body-s tw:text-foreground">
                  {deliveryDate?.weekday}، <bdi>{deliveryTimeSlot.label}</bdi>
                </span>
              ) : (
                <span className="tw:text-body-s tw:text-muted-foreground">انتخاب نشده</span>
              )}
            </div>
          </div>
          <Separator orientation="vertical" className="tw:h-11 tw:flex-none" />
          <Button className="tw:flex-auto tw:w-10" size="lg" disabled={!canPay}>
            {canPay ? 'پرداخت' : 'زمان ارسال را انتخاب کنید'}
          </Button>
        </CardFooter>
      </Card>
    </footer>
  );
}
