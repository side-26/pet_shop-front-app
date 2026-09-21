'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductWeightSelector } from './product-weight-selector';

type ProductPurchaseControlsProps = Readonly<{
  price: number;
  previousPrice?: number;
  quantity: number;
  isSkeleton?: boolean;
  mode: 'desktop' | 'mobile';
  weights?: ProductDetailViewModel['weights'];
}>;

export function ProductPurchaseControls({
  price,
  previousPrice,
  quantity,
  isSkeleton,
  mode,
  weights = [],
}: ProductPurchaseControlsProps) {
  const isDesktop = mode === 'desktop';
  const selectedWeightIdRef = useRef('');
  const [selectedWeightId, setSelectedWeightId] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const resolvedWeightId = weights.some((weight) => weight.id === selectedWeightId)
    ? selectedWeightId
    : (weights[0]?.id ?? '');
  const selectedWeight = weights.find((weight) => weight.id === resolvedWeightId) ?? weights[0];
  const selectedPrice = selectedWeight?.price ?? price;
  const selectedDiscountPercentage = selectedWeight?.discountPercentage ?? 0;
  const selectedPayablePrice = Math.floor(selectedPrice * (1 - selectedDiscountPercentage / 100));
  const selectedQuantity = selectedWeight?.quantity ?? quantity;
  const currentPrice = selectedWeight ? selectedPayablePrice : price;
  const currentPreviousPrice = selectedWeight ? selectedPrice : previousPrice;
  const currentQuantity = selectedWeight ? selectedQuantity : quantity;
  const handleWeightChange = (weightId: string) => {
    selectedWeightIdRef.current = weightId;
    setSelectedWeightId(weightId);
    setPurchaseQuantity(1);
    setIsAddedToCart(false);
  };

  const handleAddToCart = () => {
    setPurchaseQuantity(1);
    setIsAddedToCart(true);
  };

  const handleRemoveFromCart = () => {
    setPurchaseQuantity(0);
    setIsAddedToCart(false);
  };

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
        <>
          {weights.length > 0 ? (
            <ProductWeightSelector
              idPrefix="product-weight-desktop"
              weights={weights}
              value={resolvedWeightId}
              onValueChange={handleWeightChange}
              disabled={isSkeleton}
            />
          ) : null}
          <div className="tw:mb-4 tw:mt-5 tw:flex tw:items-end tw:justify-between tw:gap-3">
            <div className="tw:flex tw:flex-col tw:gap-1">
              {currentPreviousPrice && currentPreviousPrice > currentPrice ? (
                <Price
                  number={currentPreviousPrice}
                  className="tw:text-label-s tw:text-muted-foreground tw:line-through"
                />
              ) : null}
              <Price number={currentPrice} className="tw:text-price-m tw:text-primary" />
            </div>
            {selectedQuantity > 0 && selectedQuantity < 8 ? (
              <span className="tw:text-label-s tw:text-muted-foreground">
                موجودی: {selectedQuantity.toLocaleString('fa-IR')}
              </span>
            ) : null}
          </div>
        </>
      ) : null}

      {!isDesktop ? (
        <div className="tw:mb-3 tw:flex tw:items-end tw:justify-between tw:gap-3">
          <ProductWeightSelector
            idPrefix="product-weight-mobile"
            weights={weights}
            value={resolvedWeightId}
            onValueChange={handleWeightChange}
            disabled={isSkeleton}
            className="tw:min-w-0 tw:flex-1 tw:gap-2"
          />
          <div
            data-slot="mobile-price-column"
            aria-live="polite"
            className="tw:flex tw:shrink-0 tw:flex-col tw:items-end tw:gap-0.5 tw:text-end"
          >
            {selectedDiscountPercentage > 0 && currentPreviousPrice ? (
              <Price
                number={currentPreviousPrice}
                className="tw:text-label-s tw:text-muted-foreground tw:line-through"
              />
            ) : null}
            <Price number={currentPrice} className="tw:text-label-s tw:text-primary" />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'tw:flex tw:items-center tw:gap-2',
          !isDesktop && isAddedToCart && 'tw:justify-center tw:sm:justify-start',
        )}
      >
        <Counter
          min={1}
          max={Math.min(2, currentQuantity)}
          value={purchaseQuantity}
          onValueChange={setPurchaseQuantity}
          size="lg"
          variant="outlined"
          aria-label="تعداد محصول"
          incrementLabel="افزایش تعداد"
          decrementLabel="کاهش تعداد"
          className={cn('tw:w-fit', !isDesktop && !isAddedToCart && 'tw:hidden tw:sm:flex')}
        />
        {!isDesktop && isAddedToCart ? (
          <Button
            iconOnly
            size="lg"
            variant="outlined"
            color="error"
            aria-label="حذف از سبد خرید"
            className="tw:sm:hidden"
            disabled={isSkeleton}
            onClick={handleRemoveFromCart}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        ) : null}
        <Button
          block
          size="lg"
          className={cn(
            'tw:min-w-0 tw:sm:flex-1',
            !isDesktop && isAddedToCart && 'tw:hidden tw:sm:inline-flex',
          )}
          disabled={currentQuantity < 1 || isSkeleton}
          onClick={handleAddToCart}
        >
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          افزودن به سبد خرید
        </Button>
      </div>
      {currentQuantity > 0 && currentQuantity < 8 ? (
        <p className="tw:mt-3 tw:text-label-s tw:text-error" role="status">
          تنها {currentQuantity.toLocaleString('fa-IR')} عدد از این محصول باقی مانده است.
        </p>
      ) : null}
    </div>
  );
}
