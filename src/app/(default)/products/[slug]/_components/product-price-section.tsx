import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

type ProductPriceSectionProps = Readonly<{
  finalPrice: number;
  realPrice?: number;
  mode: 'desktop' | 'mobile';
}>;

/** Shows the selected weight's payable price and, when discounted, its original price. */
export function ProductPriceSection({ finalPrice, realPrice, mode }: ProductPriceSectionProps) {
  const hasDiscount = realPrice !== undefined && realPrice > finalPrice;

  return (
    <div
      data-slot={mode === 'mobile' ? 'mobile-price-column' : 'desktop-price-section'}
      aria-live="polite"
      className={cn(
        'tw:flex tw:flex-col',
        mode === 'desktop' ? 'tw:gap-1' : 'tw:shrink-0 tw:items-end tw:gap-0.5 tw:text-end',
      )}
    >
      {hasDiscount ? (
        <Price
          number={realPrice}
          className="tw:text-label-s tw:text-muted-foreground tw:line-through"
        />
      ) : null}
      <Price
        number={finalPrice}
        className={
          mode === 'desktop' ? 'tw:text-price-m tw:text-primary' : 'tw:text-label-s tw:text-primary'
        }
      />
    </div>
  );
}
