'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ProductAddToCartControl } from './product-add-to-cart-control';
import type { ProductDetailWeightViewModel, ProductPurchaseOption } from './product-detail-data';
import { ProductPriceSection } from './product-price-section';
import { ProductWeightSelector } from './product-weight-selector';

type ProductPurchaseControlsProps = Readonly<{
  productId: string;
  defaultPurchase: ProductPurchaseOption;
  mode: 'desktop' | 'mobile';
  weights?: readonly ProductDetailWeightViewModel[];
}>;

export function ProductPurchaseControls({
  productId,
  defaultPurchase,
  mode,
  weights = [],
}: ProductPurchaseControlsProps) {
  const isDesktop = mode === 'desktop';
  const [selectedWeightId, setSelectedWeightId] = useState('');
  const resolvedWeightId = weights.some((weight) => weight.id === selectedWeightId)
    ? selectedWeightId
    : (weights[0]?.id ?? '');
  const selectedWeight = weights.find((weight) => weight.id === resolvedWeightId) ?? weights[0];
  const selectedPurchase = selectedWeight ?? defaultPurchase;
  const handleWeightChange = (weightId: string) => {
    setSelectedWeightId(weightId);
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
            />
          ) : null}
          <div className="tw:mb-4 tw:mt-5 tw:flex tw:items-end tw:justify-between tw:gap-3">
            <ProductPriceSection
              mode="desktop"
              finalPrice={selectedPurchase.payablePrice}
              realPrice={selectedPurchase.previousPrice}
            />
            {selectedPurchase.quantity > 0 && selectedPurchase.quantity < 8 ? (
              <span className="tw:text-label-s tw:text-muted-foreground">
                موجودی: {selectedPurchase.quantity.toLocaleString('fa-IR')}
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
            className="tw:min-w-0 tw:flex-1 tw:gap-2"
          />
          <ProductPriceSection
            mode="mobile"
            finalPrice={selectedPurchase.payablePrice}
            realPrice={selectedPurchase.previousPrice}
          />
        </div>
      ) : null}

      <ProductAddToCartControl
        productId={productId}
        weight={selectedWeight?.cartWeight}
        maxQuantity={selectedPurchase.quantity}
      />
      {selectedPurchase.quantity > 0 && selectedPurchase.quantity < 8 ? (
        <p className="tw:mt-3 tw:text-label-s tw:text-error" role="status">
          تنها {selectedPurchase.quantity.toLocaleString('fa-IR')} عدد از این محصول باقی مانده است.
        </p>
      ) : null}
    </div>
  );
}
