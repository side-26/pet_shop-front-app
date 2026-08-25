'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

type ProductPurchaseControlsProps = Readonly<{
  price: number;
  previousPrice: number;
  stock: number;
  mode: 'desktop' | 'mobile';
}>;

export function ProductPurchaseControls({
  price,
  previousPrice,
  stock,
  mode,
}: ProductPurchaseControlsProps) {
  const isDesktop = mode === 'desktop';

  return (
    <div
      data-testid={`${mode}-purchase-controls`}
      className={cn(
        isDesktop
          ? 'tw:hidden tw:rounded-2xl tw:border tw:border-border/70 tw:bg-muted/35 tw:p-4 tw:lg:block'
          : 'tw:fixed tw:inset-x-0 tw:bottom-20 tw:z-30 tw:border-y tw:border-border/70 tw:bg-background/95 tw:px-4 tw:py-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:inset-x-6 tw:sm:bottom-28 tw:sm:rounded-2xl tw:sm:border tw:lg:hidden',
      )}
    >
      {isDesktop ? (
        <div className="tw:mb-4 tw:flex tw:items-end tw:justify-between tw:gap-3">
          <div className="tw:flex tw:flex-col tw:gap-1">
            <Price
              number={previousPrice}
              prefix="تومان"
              className="tw:text-label-s tw:text-muted-foreground tw:line-through"
            />
            <Price number={price} prefix="تومان" className="tw:text-price-m tw:text-primary" />
          </div>
          <span className="tw:text-label-s tw:text-error">
            تنها {stock.toLocaleString('fa-IR')} عدد باقیست!
          </span>
        </div>
      ) : null}

      <div className="tw:flex tw:items-center tw:gap-2">
        {!isDesktop ? (
          <Price
            number={price}
            prefix="تومان"
            className="tw:hidden tw:text-price-s tw:text-primary tw:sm:inline-flex"
          />
        ) : null}
        <Counter
          min={1}
          max={stock}
          defaultValue={1}
          size="lg"
          variant="outlined"
          aria-label="تعداد محصول"
          incrementLabel="افزایش تعداد"
          decrementLabel="کاهش تعداد"
        />
        <Button size="lg" className="tw:min-w-0 tw:flex-1">
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          افزودن به سبد خرید
        </Button>
      </div>
    </div>
  );
}
