'use client';

import { Heart, Share2 } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  useAddWishlistItem,
  useDeleteWishlistItem,
  useWishlist,
  wishlistQueryKey,
  type WishlistItemDTO,
} from '@/entities/users/users.client';
import type { AddWishlistItemInput } from '@/entities/users/users.schema';
import { globalErrorHandler } from '@/utils/helpers';

type ProductHeaderActionsProps = Readonly<{
  disabled?: boolean;
  itemId: string;
  itemLabel?: string;
  itemType: AddWishlistItemInput['itemType'];
  title: string;
}>;

function wishlistItemId(entry: WishlistItemDTO) {
  if (typeof entry.item === 'string') return entry.item;
  if (entry.item && typeof entry.item === 'object') {
    const item = entry.item as { _id?: unknown; id?: unknown };
    return typeof item._id === 'string' ? item._id : typeof item.id === 'string' ? item.id : null;
  }
  return null;
}

export function ProductHeaderActions({
  disabled,
  itemId,
  itemLabel = 'محصول',
  itemType,
  title,
}: ProductHeaderActionsProps) {
  const [shareStatus, setShareStatus] = useState('');
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { data: wishlist = [] } = useWishlist();
  const { mutateAsync: addWishlistItem } = useAddWishlistItem();
  const { mutateAsync: deleteWishlistItem } = useDeleteWishlistItem();
  const [optimisticWishlist, updateOptimisticWishlist] = useOptimistic(
    wishlist,
    (state, optimisticItem: AddWishlistItemInput) =>
      state.some(
        (entry) =>
          wishlistItemId(entry) === optimisticItem.itemId &&
          entry.itemType === optimisticItem.itemType,
      )
        ? state.filter(
            (entry) =>
              wishlistItemId(entry) !== optimisticItem.itemId ||
              entry.itemType !== optimisticItem.itemType,
          )
        : [
            ...state,
            {
              _id: `optimistic-${optimisticItem.itemId}`,
              item: optimisticItem.itemId,
              itemType: optimisticItem.itemType,
            },
          ],
  );
  const wishlistEntry = optimisticWishlist.find(
    (entry) => wishlistItemId(entry) === itemId && entry.itemType === itemType,
  );
  const isWishlisted = Boolean(wishlistEntry);

  function toggleWishlist() {
    if (disabled || isPending) return;

    startTransition(async () => {
      const wishlistItem = { itemId, itemType };
      updateOptimisticWishlist(wishlistItem);
      const result = isWishlisted
        ? await deleteWishlistItem(wishlistEntry!._id)
        : await addWishlistItem(wishlistItem);

      if (!result || !result.isSuccess) {
        if (!result) return;
        globalErrorHandler(result);
        return;
      }

      queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
        isWishlisted
          ? current.filter(
              (entry) => wishlistItemId(entry) !== itemId || entry.itemType !== itemType,
            )
          : [...current, result.data as WishlistItemDTO],
      );
    });
  }

  const shareProduct = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }

      await navigator.clipboard?.writeText(window.location.href);
      setShareStatus(`پیوند ${itemLabel} کپی شد`);
    } catch {
      setShareStatus('اشتراک‌گذاری لغو شد');
    }
  };

  return (
    <div className="tw:flex tw:items-center tw:gap-1">
      <Toggle
        disabled={disabled || isPending}
        iconOnly
        size="md"
        variant="flat"
        color="error"
        aria-label={`افزودن ${itemLabel} به علاقه‌مندی‌ها`}
        pressed={isWishlisted}
        onPressedChange={toggleWishlist}
      >
        <Heart
          aria-hidden="true"
          className="tw:transition-[fill] tw:group-data-pressed/toggle:fill-current"
        />
      </Toggle>
      <Button
        iconOnly
        size="md"
        variant="flat"
        color="secondary"
        aria-label={`اشتراک‌گذاری ${itemLabel}`}
        disabled={disabled}
        onClick={() => void shareProduct()}
      >
        <Share2 aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {shareStatus}
      </span>
    </div>
  );
}
