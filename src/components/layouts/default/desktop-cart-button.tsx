'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';

type CountMotion = 'increase' | 'decrease' | null;

function getCartItemCount(items: ReturnType<typeof useCartStore.getState>['items']): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function DesktopCartButton() {
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const previousItemCount = useRef<number | null>(null);
  const [countMotion, setCountMotion] = useState<CountMotion>(null);

  useEffect(() => {
    const previousCount = previousItemCount.current;
    previousItemCount.current = itemCount;

    if (previousCount === null || previousCount === itemCount) return;
    setCountMotion(itemCount > previousCount ? 'increase' : 'decrease');
  }, [itemCount]);

  const countLabel = itemCount.toLocaleString('fa-IR');

  return (
    <Link
      href={routePaths.cart}
      aria-label="سبد خرید"
      data-icon-only="true"
      className={cn(
        buttonVariants({ variant: 'tonal', color: 'primary', size: 'lg' }),
        'tw:relative tw:hidden tw:lg:inline-flex',
      )}
    >
      <ShoppingCart aria-hidden="true" />
      {itemCount > 0 ? (
        <Badge
          key={`${itemCount}-${countMotion ?? 'idle'}`}
          aria-hidden="true"
          color="error"
          size="xs"
          className="tw:absolute tw:-top-1 tw:-end-1 tw:min-w-4 tw:px-1 tw:before:pointer-events-none tw:before:absolute tw:before:inset-y-0 tw:before:start-0 tw:before:w-1/2 tw:before:-translate-x-[160%] tw:before:skew-x-[-18deg] tw:before:bg-background/65 tw:before:opacity-0 tw:before:animate-[cart-badge-shine_600ms_ease-out] tw:motion-reduce:before:animate-none"
        >
          <span
            key={`${itemCount}-${countMotion ?? 'idle'}`}
            className={cn(
              'tw:relative tw:tabular-nums tw:motion-reduce:animate-none',
              countMotion === 'increase' && 'tw:animate-[cart-count-increase_260ms_ease-out]',
              countMotion === 'decrease' && 'tw:animate-[cart-count-decrease_260ms_ease-out]',
            )}
          >
            {countLabel}
          </span>
        </Badge>
      ) : null}
    </Link>
  );
}
