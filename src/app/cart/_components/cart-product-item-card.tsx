'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { useCartStore } from '@/stores/cart.store';
import type { CartProductItem } from './cart-data';

type CartItemCardProps = Readonly<{
  item?: CartProductItem;
  isSkeleton?: boolean;
  onQuantityChanged: (id: string, quantity: number) => void;
}>;

export function CartProductItemCard({
  item,
  isSkeleton = false,
  onQuantityChanged,
}: CartItemCardProps) {
  const [isPending, setIsPending] = useState(false);
  const setQuantity = useCartStore((state) => state.setQuantity);
  async function updateQuantity(quantity: number) {
    if (!item || isSkeleton) return;
    setIsPending(true);
    const result = await setQuantity(item.cartItem, quantity);
    if (result.isSuccess) onQuantityChanged(item.id, quantity);
    setIsPending(false);
  }

  return (
    <Card
      variant="elevated"
      size="sm"
      aria-busy={isSkeleton || undefined}
      className={`tw:w-full tw:lg:shrink-0 tw:lg:py-2${isSkeleton ? ' skeleton tw:pointer-events-none tw:select-none' : ''}`}
    >
      <CardContent className="tw:grid tw:grid-cols-[minmax(4.5rem,26vw)_minmax(0,1fr)] tw:items-start tw:gap-3 tw:sm:grid-cols-[minmax(6.5rem,18vw)_minmax(0,1fr)] tw:sm:gap-5 tw:lg:grid-cols-[auto_minmax(0,1fr)] tw:lg:items-stretch tw:lg:gap-4 tw:lg:px-3">
        <div className="tw:relative tw:w-full tw:aspect-square tw:self-start tw:overflow-hidden tw:rounded-2xl tw:bg-muted tw:lg:h-full tw:lg:w-auto tw:lg:self-stretch">
          {item ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 640px) 136px, 104px"
              className="tw:object-cover"
            />
          ) : null}
        </div>
        <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-3 tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_auto] tw:lg:items-center tw:lg:gap-4">
          <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1 tw:lg:gap-0.5">
            <h3 className="tw:line-clamp-2 tw:text-title-s tw:leading-7 tw:text-card-foreground tw:sm:text-title-m tw:lg:leading-5">
              {item?.title ?? '—'}
            </h3>
            <p className="tw:text-body-s tw:text-muted-foreground">{item?.detail ?? '—'}</p>
          </div>
          <div className="tw:mt-auto tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-2 tw:sm:gap-3 tw:lg:mt-0 tw:lg:items-center tw:lg:gap-4">
            <div className="tw:flex tw:flex-col tw:items-end tw:gap-0.5">
              <Price
                number={(item?.price ?? 0) * (item?.quantity ?? 1)}
                className="tw:text-label-s tw:text-primary"
              />
            </div>
            <Counter
              value={item?.quantity ?? 1}
              min={0}
              max={item?.stock ?? 1}
              size="sm"
              variant="outlined"
              isLoading={isSkeleton || isPending}
              aria-label={item ? `تعداد ${item.title}` : 'تعداد کالا'}
              removeLabel={item ? `حذف ${item.title}` : 'حذف کالا'}
              onValueChange={(quantity) => void updateQuantity(quantity)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
