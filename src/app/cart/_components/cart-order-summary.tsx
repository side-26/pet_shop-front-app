import { ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

type CartOrderSummaryProps = Readonly<{
  itemCount: number;
  merchandiseTotal: number;
  discountTotal: number;
  isSkeleton?: boolean;
}>;

function SummaryRow({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
      <dt className="tw:text-body-m tw:text-muted-foreground">{label}</dt>
      <dd className="tw:text-label-l tw:text-card-foreground">
        <Price number={value} />
      </dd>
    </div>
  );
}

export function CartOrderSummary({
  itemCount,
  merchandiseTotal,
  discountTotal,
  isSkeleton = false,
}: CartOrderSummaryProps) {
  return (
    <footer
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:fixed tw:inset-x-0 tw:bottom-0 tw:z-30 tw:mx-auto tw:w-full tw:max-w-3xl tw:p-2 tw:pb-[max(0.5rem,env(safe-area-inset-bottom))] tw:sm:p-3 tw:sm:pb-3 tw:lg:sticky tw:lg:top-24 tw:lg:bottom-auto tw:lg:max-w-none tw:lg:self-start tw:lg:p-0',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <Card
        variant="glass"
        size="sm"
        className="tw:rounded-b-none tw:shadow-2xl tw:shadow-foreground/15 tw:lg:rounded-b-3xl tw:lg:shadow-xl tw:lg:shadow-foreground/8"
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:px-(--card-spacing) tw:lg:hidden">
          <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-0.5">
            <span className="tw:text-label-s tw:text-muted-foreground">مبلغ قابل پرداخت</span>
            <Price number={merchandiseTotal} className="tw:text-price-m tw:text-primary" />
          </div>
          <Button
            nativeButton={false}
            render={<Link href={routePaths.checkout} />}
            size="md"
            disabled={isSkeleton}
          >
            ادامه خرید
          </Button>
        </div>
        <CardHeader className="tw:hidden tw:lg:grid">
          <CardTitle className="tw:text-title-l">خلاصه سفارش</CardTitle>
        </CardHeader>
        <CardContent className="tw:hidden tw:lg:block">
          <dl className="tw:flex tw:flex-col tw:gap-4">
            <SummaryRow
              label={`قیمت آیتم ها(${itemCount.toLocaleString('fa-IR')})`}
              value={merchandiseTotal + discountTotal}
            />
            <SummaryRow label="تخفیف آیتم ها" value={discountTotal} />
          </dl>
          <Separator className="tw:my-5" />
          <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
            <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
            <Price number={merchandiseTotal} className="tw:text-price-m tw:text-primary" />
          </div>
        </CardContent>
        <CardFooter className="tw:hidden tw:flex-col tw:items-stretch tw:lg:flex">
          <Button
            nativeButton={false}
            render={<Link href={routePaths.checkout} />}
            block
            size="lg"
            disabled={isSkeleton}
          >
            ادامه فرایند خرید
          </Button>
          <p className="tw:flex tw:items-center tw:justify-center tw:gap-1.5 tw:text-label-s tw:text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="tw:size-4" />
            پرداخت امن و تضمین اصالت کالا
          </p>
        </CardFooter>
      </Card>
      <div className="tw:hidden tw:grid-cols-2 tw:gap-3 tw:text-label-s tw:text-muted-foreground tw:lg:grid">
        <p className="tw:flex tw:items-center tw:gap-2">
          <Truck aria-hidden="true" className="tw:size-5 tw:text-primary" />
          ارسال سریع
        </p>
        <p className="tw:flex tw:items-center tw:justify-end-safe tw:gap-2">
          <ShieldCheck aria-hidden="true" className="tw:size-5 tw:text-primary" />
          خرید مطمئن
        </p>
      </div>
    </footer>
  );
}
