'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { CartItem } from './cart-data';
import { CartEmptyState } from './cart-empty-state';
import { CartItemCard } from './cart-item-card';
import { CartOrderSummary } from './cart-order-summary';

type CartLine = CartItem & { quantity: number };
type CartOrderProps = Readonly<{ initialItems: readonly CartItem[]; isSkeleton?: boolean }>;

const cartSkeletonItemIds = ['cart-skeleton-item-1', 'cart-skeleton-item-2'] as const;

export function CartOrder({ initialItems, isSkeleton = false }: CartOrderProps) {
  const [items, setItems] = useState<readonly CartLine[]>(initialItems);
  const router = useRouter();
  const hasPendingServerSync = useCartStore(
    (state) => state.needsServerSync || state.pendingAddOperations.length > 0,
  );
  const syncLocalToServer = useCartStore((state) => state.syncLocalToServer);
  const hasItems = items.length > 0;
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
        {isSkeleton
          ? cartSkeletonItemIds.map((id) => (
              <CartItemCard key={id} isSkeleton onQuantityChanged={handleQuantityChanged} />
            ))
          : items.map((item) => (
              <CartItemCard key={item.id} item={item} onQuantityChanged={handleQuantityChanged} />
            ))}
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
