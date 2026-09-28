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
    <aside
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:flex-col tw:gap-4 tw:lg:h-fit',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <Card variant="glass" size="md">
        <CardHeader>
          <CardTitle className="tw:text-title-l">خلاصه سفارش</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="tw:flex tw:flex-col tw:gap-4">
            <SummaryRow
              label={`قیمت کالاها (${itemCount.toLocaleString('fa-IR')})`}
              value={merchandiseTotal + discountTotal}
            />
            <SummaryRow label="تخفیف کالاها" value={discountTotal} />
          </dl>
          <Separator className="tw:my-5" />
          <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
            <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
            <Price number={merchandiseTotal} className="tw:text-price-m tw:text-primary" />
          </div>
        </CardContent>
        <CardFooter className="tw:flex-col tw:items-stretch">
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
      <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:text-label-s tw:text-muted-foreground">
        <p className="tw:flex tw:items-center tw:gap-2">
          <Truck aria-hidden="true" className="tw:size-5 tw:text-primary" />
          ارسال سریع
        </p>
        <p className="tw:flex tw:items-center tw:justify-end-safe tw:gap-2">
          <ShieldCheck aria-hidden="true" className="tw:size-5 tw:text-primary" />
          خرید مطمئن
        </p>
      </div>
    </aside>
  );
}
