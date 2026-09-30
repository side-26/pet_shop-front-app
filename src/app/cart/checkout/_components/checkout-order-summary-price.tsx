'use client';

import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { useCheckoutStore } from '@/stores/checkout.store';

export function CheckoutOrderSummaryPrice() {
  const prices = useCheckoutStore((state) => state.prices);

  return (
    <>
      <dl className="tw:flex tw:flex-col tw:gap-3">
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">قیمت کالاها</dt>
          <dd className="tw:text-label-m">
            <Price number={prices.productPrice} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">هزینه بسته‌بندی</dt>
          <dd className="tw:text-label-m">
            <Price number={prices.packingPrice} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">تخفیف کالاها</dt>
          <dd className="tw:text-label-m tw:text-error">
            <Price number={prices.discountPrice} />
          </dd>
        </div>
        <div className="tw:flex tw:justify-between tw:gap-4">
          <dt className="tw:text-body-s tw:text-muted-foreground">هزینه ارسال</dt>
          <dd
            className={
              prices.shippingPrice === 0 ? 'tw:text-label-m tw:text-success' : 'tw:text-label-m'
            }
          >
            {prices.shippingPrice === 0 ? 'رایگان' : <Price number={prices.shippingPrice} />}
          </dd>
        </div>
      </dl>
      <Separator />
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
        <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
        <Price number={prices.payablePrice} className="tw:text-price-m tw:text-primary" />
      </div>
    </>
  );
}
