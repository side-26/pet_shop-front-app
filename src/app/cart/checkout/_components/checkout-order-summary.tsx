import { PackageCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import { CheckoutCartItems } from './checkout-cart-items/checkout-cart-items';
import { CheckoutOrderSummaryFullDate } from './checkout-order-summary-full-date';
import { CheckoutOrderSummaryPrice } from './checkout-order-summary-price';

export function CheckoutOrderSummary() {
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
          <CheckoutCartItems />
          <Separator />
          <CheckoutOrderSummaryFullDate />
          <Separator />
          <CheckoutOrderSummaryPrice />
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
