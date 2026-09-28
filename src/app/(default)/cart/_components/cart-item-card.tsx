'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Counter } from '@/components/ui/counter';
import { Price } from '@/components/ui/price';
import { useCartStore } from '@/stores/cart.store';
import type { CartItem } from './cart-data';

type CartLine = CartItem & { quantity: number };
type CartItemCardProps = Readonly<{
  item?: CartLine;
  isSkeleton?: boolean;
  onQuantityChanged: (id: string, quantity: number) => void;
}>;

export function CartItemCard({ item, isSkeleton = false, onQuantityChanged }: CartItemCardProps) {
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
      className={`tw:lg:shrink-0 tw:lg:py-2${isSkeleton ? ' skeleton tw:pointer-events-none tw:select-none' : ''}`}
    >
      <CardContent className="tw:grid tw:grid-cols-[6.5rem_minmax(0,1fr)] tw:gap-4 tw:sm:grid-cols-[8.5rem_minmax(0,1fr)] tw:sm:gap-6 tw:lg:grid-cols-[4rem_minmax(0,1fr)] tw:lg:gap-4 tw:lg:px-3">
        <div className="tw:relative tw:aspect-square tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
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
            <h3 className="tw:text-title-s tw:leading-7 tw:text-card-foreground tw:sm:text-title-m tw:lg:truncate tw:lg:leading-5">
              {item?.title ?? '—'}
            </h3>
            <p className="tw:text-body-s tw:text-muted-foreground">{item?.detail ?? '—'}</p>
          </div>
          <div className="tw:mt-auto tw:flex tw:flex-col tw:items-start tw:gap-3 tw:sm:flex-row tw:sm:items-end tw:sm:justify-between tw:lg:mt-0 tw:lg:items-center tw:lg:gap-4">
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
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-0.5 tw:sm:items-end">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      iconOnly
                      size="sm"
                      variant="transparent"
                      color="error"
                      disabled={isSkeleton || isPending}
                      aria-label={
                        item ? `حذف کالا از سبد خرید: ${item.title}` : 'حذف کالا از سبد خرید'
                      }
                    />
                  }
                >
                  <Trash2 aria-hidden="true" />
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف کالا از سبد خرید</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از حذف «{item?.title}» از سبد خرید مطمئن هستید؟
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction color="error" onClick={() => void updateQuantity(0)}>
                      حذف کالا
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {item?.previousPrice ? (
                <Price
                  number={item.previousPrice * item.quantity}
                  className="tw:text-label-s tw:text-muted-foreground tw:line-through"
                />
              ) : null}
              <Price
                number={(item?.price ?? 0) * (item?.quantity ?? 1)}
                className="tw:text-price-s tw:text-primary"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
