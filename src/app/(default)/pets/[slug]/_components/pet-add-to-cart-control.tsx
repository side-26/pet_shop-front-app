'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart.store';

type PetAddToCartControlProps = Readonly<{
  petId: string;
  petTitle: string;
  disabled?: boolean;
}>;

/** Renders the pre-order or remove action for one exact pet cart entry. */
export function PetAddToCartControl({
  petId,
  petTitle,
  disabled = false,
}: PetAddToCartControlProps) {
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.type === 'pet' && item.petId === petId),
  );
  const isSyncing = useCartStore((state) => state.isSyncing);
  const hasPendingAddOperation = useCartStore((state) =>
    state.pendingAddOperations.some(
      (operation) => operation.item.type === 'pet' && operation.item.petId === petId,
    ),
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const isLoading = isSyncing || hasPendingAddOperation;

  if (cartItem) {
    return (
      <Button
        size="lg"
        variant="outlined"
        color="error"
        disabled={disabled}
        isLoading={isLoading}
        loadingText="در حال حذف از سبد خرید"
        className="tw:shrink-0"
        aria-label={`حذف ${petTitle} از سبد خرید`}
        onClick={() => void removeFromCart(cartItem)}
      >
        <Trash2 data-icon="inline-start" aria-hidden="true" />
        حذف از سبد خرید
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      disabled={disabled}
      isLoading={isLoading}
      loadingText="در حال ثبت پیش‌سفارش"
      className="tw:shrink-0"
      aria-label={`پیش‌سفارش ${petTitle}`}
      onClick={() => void addToCart({ type: 'pet', petId })}
    >
      <ShoppingCart data-icon="inline-start" aria-hidden="true" />
      پیش‌سفارش
    </Button>
  );
}
