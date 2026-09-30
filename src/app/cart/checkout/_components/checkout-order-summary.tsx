import { CalendarDays, PackageCheck, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';

type CheckoutOrderSummaryProps = Readonly<{
  items: readonly Readonly<{ id: string; title: string; image: string; quantity: number }>[];
  selectedDate?: Readonly<{ weekday: string }>;
  selectedTimeSlot?: Readonly<{ label: string }>;
  shippingPrice: number;
  totals: Readonly<{ merchandise: number; discount: number; payable: number }>;
}>;

export function CheckoutOrderSummary({
  items,
  selectedDate,
  selectedTimeSlot,
  shippingPrice,
  totals,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="tw:flex tw:flex-col tw:gap-4 tw:lg:sticky tw:lg:top-24 tw:lg:self-start">
      <Card variant="glass" size="md">
        <CardHeader className="tw:flex tw:flex-row tw:items-center tw:justify-between tw:gap-3">
          <CardTitle className="tw:text-title-l">خلاصه سفارش</CardTitle>
          <Button
            nativeButton={false}
            render={<Link href={routePaths.cart} />}
            size="xs"
            variant="text"
          >
            سبد خرید
          </Button>
        </CardHeader>
        <CardContent className="tw:flex tw:flex-col tw:gap-4">
          <ul className="tw:flex tw:flex-col tw:gap-3" aria-label="کالاهای سفارش">
            {items.map((item) => (
              <li key={item.id} className="tw:flex tw:items-center tw:gap-3">
                <span className="tw:relative tw:size-12 tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:bg-muted">
                  <Image src={item.image} alt="" fill sizes="48px" className="tw:object-cover" />
                </span>
                <span className="tw:min-w-0 tw:flex-1 tw:truncate tw:text-body-s">
                  {item.title}
                </span>
                <Badge size="sm" variant="tonal" color="secondary">
                  {item.quantity.toLocaleString('fa-IR')} عدد
                </Badge>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-muted tw:p-3">
            <CalendarDays
              aria-hidden="true"
              className="tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-primary"
            />
            <p className="tw:text-body-s tw:text-muted-foreground">
              تحویل {selectedDate?.weekday}، ساعت <bdi>{selectedTimeSlot?.label}</bdi>
            </p>
          </div>
          <Separator />
          <dl className="tw:flex tw:flex-col tw:gap-3">
            <div className="tw:flex tw:justify-between tw:gap-4">
              <dt className="tw:text-body-s tw:text-muted-foreground">قیمت کالاها</dt>
              <dd className="tw:text-label-m">
                <Price number={totals.merchandise} />
              </dd>
            </div>
            <div className="tw:flex tw:justify-between tw:gap-4">
              <dt className="tw:text-body-s tw:text-muted-foreground">تخفیف کالاها</dt>
              <dd className="tw:text-label-m tw:text-error">
                <Price number={totals.discount} />
              </dd>
            </div>
            <div className="tw:flex tw:justify-between tw:gap-4">
              <dt className="tw:text-body-s tw:text-muted-foreground">هزینه ارسال</dt>
              <dd
                className={
                  shippingPrice === 0 ? 'tw:text-label-m tw:text-success' : 'tw:text-label-m'
                }
              >
                {shippingPrice === 0 ? 'رایگان' : <Price number={shippingPrice} />}
              </dd>
            </div>
          </dl>
          <Separator />
          <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
            <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
            <Price
              number={totals.payable + shippingPrice}
              className="tw:text-price-m tw:text-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="tw:flex-col tw:items-stretch">
          <Button block size="lg">
            ادامه و پرداخت
          </Button>
          <p className="tw:flex tw:items-center tw:justify-center tw:gap-1.5 tw:text-label-s tw:text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="tw:size-4" />
            پرداخت امن و تضمین اصالت کالا
          </p>
        </CardFooter>
      </Card>
      <p className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-label-s tw:text-muted-foreground">
        <PackageCheck aria-hidden="true" className="tw:size-4 tw:text-primary" />
        تمام کالاها آماده ارسال هستند.
      </p>
    </aside>
  );
}
