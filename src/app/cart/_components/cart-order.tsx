'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { CartItem, CartPetItem, CartProductItem } from './cart-data';
import { CartEmptyState } from './cart-empty-state';
import { CartPetItemCard } from './cart-pet-item-card';
import { CartProductItemCard } from './cart-product-item-card';
import { CartOrderSummary } from './cart-order-summary';

type CartLine = CartItem & { quantity: number };
type CartOrderProps = Readonly<{ initialItems: readonly CartItem[]; isSkeleton?: boolean }>;

export function CartOrder({ initialItems, isSkeleton = false }: CartOrderProps) {
  const [items, setItems] = useState<readonly CartLine[]>(initialItems);
  const router = useRouter();
  const hasPendingServerSync = useCartStore(
    (state) => state.needsServerSync || state.pendingAddOperations.length > 0,
  );
  const syncLocalToServer = useCartStore((state) => state.syncLocalToServer);
  const hasItems = items.length > 0;
  const productItems = items.filter(
    (item): item is CartProductItem => item.cartItem.type === 'product',
  );
  const petItems = items.filter((item): item is CartPetItem => item.cartItem.type === 'pet');
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const merchandiseTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const discountTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + ((item.previousPrice ?? item.price) - item.price) * item.quantity,
        0,
      ),
    [items],
  );

  useEffect(() => {
    if (isSkeleton || items.length > 0 || !hasPendingServerSync) return;
    void syncLocalToServer().then((result) => {
      if (result.isSuccess) router.refresh();
    });
  }, [hasPendingServerSync, isSkeleton, items.length, router, syncLocalToServer]);

  function handleQuantityChanged(id: string, quantity: number) {
    setItems((currentItems) =>
      quantity === 0
        ? currentItems.filter((item) => item.id !== id)
        : currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  function handleItemRemoved(id: string) {
    handleQuantityChanged(id, 0);
  }

  return (
    <div
      className={cn(
        'tw:grid tw:items-start tw:gap-6 tw:lg:min-h-0 tw:lg:flex-1 tw:xl:gap-8',
        hasItems || isSkeleton ? 'tw:lg:grid-cols-[minmax(0,1fr)_21rem]' : 'tw:lg:grid-cols-1',
      )}
      aria-busy={isSkeleton || undefined}
    >
      <section
        aria-labelledby="cart-items-title"
        className="tw:flex tw:min-w-0 tw:flex-col tw:gap-4 tw:lg:h-full tw:lg:min-h-0 tw:lg:overflow-y-auto tw:lg:pe-2 tw:lg:[scrollbar-gutter:stable]"
      >
        <h2 id="cart-items-title" className="tw:sr-only">
          کالاهای سبد خرید
        </h2>
        {isSkeleton ? (
          <>
            <section
              aria-labelledby="cart-products-title"
              className="tw:flex tw:flex-col tw:gap-3 tw:md:grid tw:md:grid-cols-2"
            >
              <h3
                id="cart-products-title"
                className="tw:text-title-m tw:text-foreground tw:md:col-span-2"
              >
                محصولات
              </h3>
              <CartProductItemCard isSkeleton onQuantityChanged={handleQuantityChanged} />
            </section>
            <section
              aria-labelledby="cart-pets-title"
              className="tw:flex tw:flex-col tw:gap-3 tw:md:grid tw:md:grid-cols-2"
            >
              <h3
                id="cart-pets-title"
                className="tw:text-title-m tw:text-foreground tw:md:col-span-2"
              >
                حیوانات
              </h3>
              <CartPetItemCard isSkeleton onRemoved={handleItemRemoved} />
            </section>
          </>
        ) : null}
        {productItems.length > 0 ? (
          <section
            aria-labelledby="cart-products-title"
            className="tw:flex tw:flex-col tw:gap-3 tw:md:grid tw:md:grid-cols-2"
          >
            <h3
              id="cart-products-title"
              className="tw:text-title-m tw:text-foreground tw:md:col-span-2"
            >
              محصولات
            </h3>
            {productItems.map((item) => (
              <CartProductItemCard
                key={item.id}
                item={item}
                onQuantityChanged={handleQuantityChanged}
              />
            ))}
          </section>
        ) : null}
        {petItems.length > 0 ? (
          <section
            aria-labelledby="cart-pets-title"
            className="tw:flex tw:flex-col tw:gap-3 tw:md:grid tw:md:grid-cols-2"
          >
            <h3
              id="cart-pets-title"
              className="tw:text-title-m tw:text-foreground tw:md:col-span-2"
            >
              حیوانات
            </h3>
            {petItems.map((item) => (
              <CartPetItemCard key={item.id} item={item} onRemoved={handleItemRemoved} />
            ))}
          </section>
        ) : null}
        {!hasItems && !isSkeleton ? <CartEmptyState /> : null}
      </section>
      {hasItems || isSkeleton ? (
        <CartOrderSummary
          itemCount={itemCount}
          merchandiseTotal={merchandiseTotal}
          discountTotal={discountTotal}
        />
      ) : null}
    </div>
  );
}
