'use client';

import { AnimatedPrice } from '@/components/ui/animated-price';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCheckoutCartPrices } from './checkout-cart-prices-context';

export function CheckoutOrderSummaryPrice({
  finalPriceClassName,
}: Readonly<{ finalPriceClassName?: string }>) {
  const { prices, isLoading } = useCheckoutCartPrices();

  return (
    <>
      <dl className="tw:flex tw:flex-col tw:gap-3">
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">قیمت کالاها</dt>
          <dd className="tw:text-label-m">
            <AnimatedPrice number={prices?.itemsPrice} isLoading={isLoading} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">هزینه بسته‌بندی</dt>
          <dd className="tw:text-label-m">
            <AnimatedPrice number={prices?.packingPrice} isLoading={isLoading} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">تخفیف کالاها</dt>
          <dd className="tw:text-label-m tw:text-error">
            <AnimatedPrice number={prices?.discountPrice} isLoading={isLoading} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">هزینه ارسال</dt>
          <dd className="tw:text-label-m">
            <AnimatedPrice number={prices?.shippingPrice} isLoading={isLoading} />
          </dd>
        </div>
      </dl>
      <Separator className={finalPriceClassName} />
      <div
        className={cn('tw:flex tw:items-center tw:justify-between tw:gap-4', finalPriceClassName)}
      >
        <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
        <AnimatedPrice
          number={prices?.payableAmount}
          isLoading={isLoading}
          className="tw:text-price-m tw:text-primary"
        />
      </div>
    </>
  );
}
