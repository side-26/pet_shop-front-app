'use client';

import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

type ProductPurchaseControlsProps = Readonly<{
  price: number;
  previousPrice: number;
  stock: number;
  mode: 'desktop' | 'mobile';
}>;

function QuantityControl({
  quantity,
  stock,
  onChange,
}: Readonly<{
  quantity: number;
  stock: number;
  onChange: (quantity: number) => void;
}>) {
  return (
    <ButtonGroup
      className="tw:h-11 tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:border tw:border-border-strong tw:bg-background"
      aria-label="تعداد محصول"
    >
      <Button
        iconOnly
        size="md"
        variant="flat"
        color="secondary"
        aria-label="افزایش تعداد"
        className="tw:size-10 tw:rounded-none tw:border-0 tw:bg-transparent tw:text-primary tw:shadow-none"
        disabled={quantity >= stock}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus aria-hidden="true" />
      </Button>
      <ButtonGroupText className="tw:min-w-10 tw:justify-center tw:rounded-none tw:border-y-0 tw:border-border/70 tw:bg-transparent tw:px-2 tw:text-title-s">
        <output aria-live="polite">{quantity.toLocaleString('fa-IR')}</output>
      </ButtonGroupText>
      <Button
        iconOnly
        size="md"
        variant="flat"
        color="secondary"
        aria-label="کاهش تعداد"
        className="tw:size-10 tw:rounded-none tw:border-0 tw:bg-transparent tw:text-muted-foreground tw:shadow-none"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

export function ProductPurchaseControls({
  price,
  previousPrice,
  stock,
  mode,
}: ProductPurchaseControlsProps) {
  const [quantity, setQuantity] = useState(1);
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
        <QuantityControl quantity={quantity} stock={stock} onChange={setQuantity} />
        <Button size="lg" className="tw:min-w-0 tw:flex-1">
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          افزودن به سبد خرید
        </Button>
      </div>
    </div>
  );
}
