'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

type ProductPurchaseControlsProps = Readonly<{
  price: number;
  previousPrice?: number;
  quantity: number;
  isSkeleton?: boolean;
  mode: 'desktop' | 'mobile';
}>;

export function ProductPurchaseControls({
  price,
  previousPrice,
  quantity,
  isSkeleton,
  mode,
}: ProductPurchaseControlsProps) {
  const isDesktop = mode === 'desktop';

  return (
    <div
      data-testid={`${mode}-purchase-controls`}
      className={cn(
        isDesktop
          ? 'tw:hidden tw:lg:block'
          : 'tw:fixed tw:inset-x-0 tw:bottom-20 tw:z-30 tw:border-y tw:border-border/70 tw:bg-background/95 tw:px-4 tw:py-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:inset-x-6 tw:sm:bottom-28 tw:sm:rounded-2xl tw:sm:border tw:lg:hidden',
      )}
    >
      {isDesktop ? (
        <div className="tw:mb-4 tw:flex tw:items-end tw:justify-between tw:gap-3">
          <div className="tw:flex tw:flex-col tw:gap-1">
            {previousPrice && previousPrice > price ? (
              <Price
                number={previousPrice}
                className="tw:text-label-s tw:text-muted-foreground tw:line-through"
              />
            ) : null}
            <Price number={price} className="tw:text-price-m tw:text-primary" />
          </div>
          {quantity > 0 && quantity < 8 ? (
            <span className="tw:text-label-s tw:text-muted-foreground">
              موجودی: {quantity.toLocaleString('fa-IR')}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="tw:flex tw:items-center tw:gap-2">
        {!isDesktop ? (
          <Price
            number={price}
            className="tw:hidden tw:text-price-s tw:text-primary tw:sm:inline-flex"
          />
        ) : null}
        <Counter
          min={1}
          max={Math.min(2, quantity)}
          defaultValue={1}
          size="lg"
          variant="outlined"
          aria-label="تعداد محصول"
          incrementLabel="افزایش تعداد"
          decrementLabel="کاهش تعداد"
        />
        <Button size="lg" className="tw:min-w-0 tw:flex-1" disabled={quantity < 1 || isSkeleton}>
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          افزودن به سبد خرید
        </Button>
      </div>
      {quantity > 0 && quantity < 8 ? (
        <p className="tw:mt-3 tw:text-label-s tw:text-error" role="status">
          تنها {quantity.toLocaleString('fa-IR')} عدد از این محصول باقی مانده است.
        </p>
      ) : null}
    </div>
  );
}
