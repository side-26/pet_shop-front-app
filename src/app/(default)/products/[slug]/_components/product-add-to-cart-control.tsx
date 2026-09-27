'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import type { ProductWeightDTO } from '@/entities/products/products.dto';
import { useCartStore } from '@/stores/cart.store';

type ProductAddToCartControlProps = Readonly<{
  productId: string;
  weight?: ProductWeightDTO;
  maxQuantity: number;
  disabled?: boolean;
}>;

function getWeightId(weight: ProductWeightDTO | undefined) {
  return weight?.id ?? weight?._id;
}

/** Renders the cart action for exactly one product-weight pair. */
export function ProductAddToCartControl({
  productId,
  weight,
  maxQuantity,
  disabled = false,
}: ProductAddToCartControlProps) {
  const weightId = getWeightId(weight);
  const cartItem = useCartStore((state) =>
    weightId
      ? state.items.find(
          (item) =>
            item.type === 'product' &&
            item.productId === productId &&
            getWeightId(item.weight) === weightId,
        )
      : undefined,
  );
  const isSyncing = useCartStore((state) => state.isSyncing);
  const hasPendingAddOperation = useCartStore((state) =>
    weightId
      ? state.pendingAddOperations.some(
          (operation) =>
            operation.item.type === 'product' &&
            operation.item.productId === productId &&
            getWeightId(operation.item.weight) === weightId,
        )
      : false,
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const isDisabled = disabled || maxQuantity < 1 || !weightId;
  const isLoading = isSyncing || hasPendingAddOperation;

  if (cartItem) {
    return (
      <Counter
        value={cartItem.quantity}
        min={0}
        max={Math.min(2, maxQuantity)}
        onValueChange={(nextQuantity) => void setQuantity(cartItem, nextQuantity)}
        isLoading={isLoading}
        size="lg"
        variant="outlined"
        aria-label="تعداد محصول"
        incrementLabel="افزایش تعداد"
        decrementLabel="کاهش تعداد"
        removeLabel="حذف از سبد خرید"
        className="tw:w-fit"
      />
    );
  }

  return (
    <Button
      block
      size="lg"
      disabled={isDisabled}
      isLoading={isLoading}
      loadingText="در حال افزودن به سبد خرید"
      onClick={() => {
        if (!weight || isDisabled) return;
        void addToCart({ type: 'product', productId, weight });
      }}
    >
      <ShoppingCart data-icon="inline-start" aria-hidden="true" />
      افزودن به سبد خرید
    </Button>
  );
}
