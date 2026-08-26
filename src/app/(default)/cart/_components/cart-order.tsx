'use client';

import { CheckCircle2, ChevronLeft, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';

import type { CartItem } from './cart-data';

type CartLine = CartItem & { quantity: number };
type CartOrderProps = Readonly<{ initialItems: readonly CartItem[] }>;

function SummaryRow({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
      <dt className="tw:text-body-m tw:text-muted-foreground">{label}</dt>
      <dd className="tw:text-label-l tw:text-card-foreground">
        <Price number={value} prefix="تومان" />
      </dd>
    </div>
  );
}

export function CartOrder({ initialItems }: CartOrderProps) {
  const [items, setItems] = useState<readonly CartLine[]>(initialItems);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const merchandiseTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const discountTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + ((item.previousPrice ?? item.price) - item.price) * item.quantity,
        0,
      ),
    [items],
  );

  function updateQuantity(id: string, quantity: number) {
    setItems((currentItems) =>
      quantity === 0
        ? currentItems.filter((item) => item.id !== id)
        : currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:min-h-0 tw:lg:flex-1 tw:lg:grid-cols-[minmax(0,1fr)_21rem] tw:xl:gap-8">
      <section
        aria-labelledby="cart-items-title"
        className="tw:flex tw:min-w-0 tw:flex-col tw:gap-4 tw:lg:h-full tw:lg:min-h-0 tw:lg:overflow-y-auto tw:lg:pe-2 tw:lg:[scrollbar-gutter:stable]"
      >
        <h2 id="cart-items-title" className="tw:sr-only">
          کالاهای سبد خرید
        </h2>
        {items.map((item) => (
          <Card key={item.id} variant="elevated" size="sm" className="tw:lg:shrink-0 tw:lg:py-2">
            <CardContent className="tw:grid tw:grid-cols-[6.5rem_minmax(0,1fr)] tw:gap-4 tw:sm:grid-cols-[8.5rem_minmax(0,1fr)] tw:sm:gap-6 tw:lg:grid-cols-[4rem_minmax(0,1fr)] tw:lg:gap-4 tw:lg:px-3">
              <div className="tw:relative tw:aspect-square tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 640px) 136px, 104px"
                  className="tw:object-cover"
                />
              </div>
              <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-3 tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_auto] tw:lg:items-center tw:lg:gap-4">
                <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1 tw:lg:gap-0.5">
                  {item.discount ? (
                    <Badge size="sm" color="error" variant="tonal">
                      {item.discount}
                    </Badge>
                  ) : null}
                  <h3 className="tw:text-title-s tw:leading-7 tw:text-card-foreground tw:sm:text-title-m tw:lg:truncate tw:lg:leading-5">
                    {item.title}
                  </h3>
                  <p className="tw:text-body-s tw:text-muted-foreground">{item.detail}</p>
                  <p className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-s tw:text-success">
                    <CheckCircle2 aria-hidden="true" className="tw:size-4" />
                    موجود در انبار
                  </p>
                </div>
                <div className="tw:mt-auto tw:flex tw:flex-col tw:items-start tw:gap-3 tw:sm:flex-row tw:sm:items-end tw:sm:justify-between tw:lg:mt-0 tw:lg:items-center tw:lg:gap-4">
                  <Counter
                    value={item.quantity}
                    min={0}
                    max={item.stock}
                    size="sm"
                    variant="outlined"
                    aria-label={`تعداد ${item.title}`}
                    removeLabel={`حذف ${item.title}`}
                    onValueChange={(quantity) => updateQuantity(item.id, quantity)}
                  />
                  <div className="tw:flex tw:flex-col tw:items-start tw:gap-0.5 tw:sm:items-end">
                    {item.previousPrice ? (
                      <Price
                        number={item.previousPrice * item.quantity}
                        prefix="تومان"
                        className="tw:text-label-s tw:text-muted-foreground tw:line-through"
                      />
                    ) : null}
                    <Price
                      number={item.price * item.quantity}
                      prefix="تومان"
                      className="tw:text-price-s tw:text-primary tw:sm:text-price-m"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 ? (
          <Card variant="outlined" size="lg">
            <CardContent className="tw:flex tw:min-h-56 tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center">
              <PackageCheck aria-hidden="true" className="tw:size-10 tw:text-primary" />
              <div className="tw:flex tw:flex-col tw:gap-1">
                <h2 className="tw:text-title-l">سبد خرید شما خالی است</h2>
                <p className="tw:text-body-m tw:text-muted-foreground">
                  محصولات مورد نیاز دوست کوچکتان را پیدا کنید.
                </p>
              </div>
              <Button nativeButton={false} render={<Link href={routePaths.productsList} />}>
                رفتن به فروشگاه
              </Button>
            </CardContent>
          </Card>
        ) : null}
        <Button
          nativeButton={false}
          render={<Link href={routePaths.productsList} />}
          variant="text"
          className="tw:self-start"
        >
          ادامه خرید
          <ChevronLeft data-icon="inline-end" aria-hidden="true" />
        </Button>
      </section>
      <aside className="tw:flex tw:flex-col tw:gap-4 tw:lg:h-fit">
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
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                <dt className="tw:text-body-m tw:text-muted-foreground">هزینه ارسال</dt>
                <dd className="tw:text-label-l tw:text-success">رایگان</dd>
              </div>
            </dl>
            <Separator className="tw:my-5" />
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
              <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
              <Price
                number={merchandiseTotal}
                prefix="تومان"
                className="tw:text-price-m tw:text-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="tw:flex-col tw:items-stretch">
            <Button
              nativeButton={false}
              render={<Link href={routePaths.checkout} />}
              block
              size="lg"
              disabled={items.length === 0}
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
    </div>
  );
}
