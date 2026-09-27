'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { cn } from '@/lib/utils';

type ProductPurchaseCounterProps = Readonly<{
  disabled?: boolean;
  max: number;
  mode: 'desktop' | 'mobile';
  quantity: number;
  onAdd: () => void;
  onQuantityChange: (quantity: number) => void;
}>;

/**
 * Renders an add action until the current product weight has a quantity, then renders its counter.
 * Quantity ownership stays with the caller so it can later be supplied by the cart for each weight.
 */
export function ProductPurchaseCounter({
  disabled = false,
  max,
  mode,
  quantity,
  onAdd,
  onQuantityChange,
}: ProductPurchaseCounterProps) {
  const hasQuantity = quantity > 0;
  const isDesktop = mode === 'desktop';

  return (
    <div
      data-slot={`${mode}-purchase-counter`}
      className={cn(
        'tw:flex tw:items-center tw:gap-2',
        !isDesktop && hasQuantity && 'tw:justify-center tw:sm:justify-start',
        disabled && hasQuantity && 'tw:pointer-events-none tw:opacity-50',
      )}
    >
      {hasQuantity ? (
        <Counter
          min={0}
          max={max}
          value={quantity}
          onValueChange={onQuantityChange}
          size="lg"
          variant="outlined"
          aria-label="تعداد محصول"
          incrementLabel="افزایش تعداد"
          decrementLabel="کاهش تعداد"
          removeLabel="حذف از سبد خرید"
          className="tw:w-fit"
        />
      ) : (
        <Button
          block
          size="lg"
          className="tw:min-w-0 tw:sm:flex-1"
          disabled={max < 1 || disabled}
          onClick={onAdd}
        >
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          افزودن به سبد خرید
        </Button>
      )}
    </div>
  );
}
