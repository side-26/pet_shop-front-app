'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductPriceSection } from './product-price-section';
import { ProductPurchaseCounter } from './product-purchase-counter';
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
  const [selectedWeightId, setSelectedWeightId] = useState('');
  const [quantityByWeightId, setQuantityByWeightId] = useState<Record<string, number>>({});
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
  const purchaseKey = selectedWeight?.id ?? 'product';
  const purchaseQuantity = quantityByWeightId[purchaseKey] ?? 0;

  const handleWeightChange = (weightId: string) => {
    setSelectedWeightId(weightId);
  };

  const setPurchaseQuantity = (nextQuantity: number) =>
    setQuantityByWeightId((quantities) => ({ ...quantities, [purchaseKey]: nextQuantity }));

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
            <ProductPriceSection
              mode="desktop"
              finalPrice={currentPrice}
              realPrice={currentPreviousPrice}
            />
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
          <ProductPriceSection
            mode="mobile"
            finalPrice={currentPrice}
            realPrice={currentPreviousPrice}
          />
        </div>
      ) : null}

      <ProductPurchaseCounter
        mode={mode}
        max={Math.min(2, currentQuantity)}
        quantity={purchaseQuantity}
        disabled={isSkeleton}
        onAdd={() => setPurchaseQuantity(1)}
        onQuantityChange={setPurchaseQuantity}
      />
      {currentQuantity > 0 && currentQuantity < 8 ? (
        <p className="tw:mt-3 tw:text-label-s tw:text-error" role="status">
          تنها {currentQuantity.toLocaleString('fa-IR')} عدد از این محصول باقی مانده است.
        </p>
      ) : null}
    </div>
  );
}
