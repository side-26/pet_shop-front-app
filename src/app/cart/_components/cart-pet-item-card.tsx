'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { useCartStore } from '@/stores/cart.store';
import { useCommonStore } from '@/stores/common.store';

import type { CartPetItem } from './cart-data';

type CartPetItemCardProps = Readonly<{
  item?: CartPetItem;
  isSkeleton?: boolean;
  onRemoved: (id: string) => void;
}>;

export function CartPetItemCard({ item, isSkeleton = false, onRemoved }: CartPetItemCardProps) {
  const [isPending, setIsPending] = useState(false);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  async function removeItem() {
    if (!item || isSkeleton) return;

    setIsPending(true);
    const result = await removeFromCart(item.cartItem);
    if (result.isSuccess) onRemoved(item.id);
    setIsPending(false);
  }

  function openRemoveConfirmation() {
    if (!item || isSkeleton) return;

    showConfirmDialog({
      title: 'حذف حیوان از سبد خرید',
      message: `آیا از حذف «${item.title}» از سبد خرید مطمئن هستید؟`,
      icon: Trash2,
      variant: 'error',
      onSuccess: removeItem,
    });
  }

  return (
    <Card
      variant="elevated"
      size="sm"
      aria-busy={isSkeleton || undefined}
      className={`tw:w-full tw:lg:shrink-0 tw:lg:py-2${isSkeleton ? ' skeleton tw:pointer-events-none tw:select-none' : ''}`}
    >
      <CardContent className="tw:grid tw:grid-cols-[minmax(4.5rem,26vw)_minmax(0,1fr)] tw:items-start tw:gap-3 tw:sm:grid-cols-[minmax(6.5rem,18vw)_minmax(0,1fr)] tw:sm:gap-5 tw:lg:grid-cols-[4rem_minmax(0,1fr)] tw:lg:gap-4 tw:lg:px-3">
        <div className="tw:relative tw:w-full tw:aspect-square tw:self-start tw:overflow-hidden tw:rounded-2xl tw:bg-muted tw:lg:size-16">
          {item ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              placeholder={item.mainThumbnailImage ? 'blur' : 'empty'}
              blurDataURL={item.mainThumbnailImage}
              sizes="(min-width: 640px) 136px, 104px"
              className="tw:object-cover"
            />
          ) : null}
        </div>
        <div className="tw:flex tw:min-w-0 tw:flex-col tw:justify-between tw:gap-3 tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_auto] tw:lg:items-center tw:lg:gap-4">
          <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1 tw:lg:gap-0.5">
            <h3 className="tw:line-clamp-2 tw:text-title-s tw:leading-7 tw:text-card-foreground tw:sm:text-title-m tw:lg:truncate tw:lg:leading-5">
              {item?.title ?? '—'}
            </h3>
            <p className="tw:text-body-s tw:text-muted-foreground">{item?.detail ?? '—'}</p>
          </div>
          <div className="tw:flex tw:flex-col tw:items-end tw:gap-0.5">
            <Button
              iconOnly
              size="sm"
              variant="transparent"
              color="error"
              disabled={isSkeleton || isPending}
              className="tw:hidden tw:lg:inline-flex"
              aria-label={item ? `حذف حیوان از سبد خرید: ${item.title}` : 'حذف حیوان از سبد خرید'}
              onClick={openRemoveConfirmation}
            >
              <Trash2 aria-hidden="true" />
            </Button>
            {item?.previousPrice ? (
              <Price
                number={item.previousPrice * item.quantity}
                className="tw:hidden tw:text-label-s tw:text-muted-foreground tw:line-through tw:lg:block"
              />
            ) : null}
            <Price
              number={(item?.price ?? 0) * (item?.quantity ?? 1)}
              className="tw:text-price-s tw:text-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
