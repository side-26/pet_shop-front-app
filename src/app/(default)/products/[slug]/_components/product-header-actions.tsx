'use client';

import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useWishlist, useWishlistToggle, wishlistItemId } from '@/entities/users/users.client';
import type { AddWishlistItemInput } from '@/entities/users/users.schema';

type ProductHeaderActionsProps = Readonly<{
  disabled?: boolean;
  itemId: string;
  itemLabel?: string;
  itemType: AddWishlistItemInput['itemType'];
  title: string;
}>;

export function ProductHeaderActions({
  disabled,
  itemId,
  itemLabel = 'محصول',
  itemType,
  title,
}: ProductHeaderActionsProps) {
  const [shareStatus, setShareStatus] = useState('');
  const { data: wishlist = [] } = useWishlist({ enabled: !disabled });
  const { isPending, toggleWishlistItem } = useWishlistToggle();
  const isWishlisted = wishlist.some(
    (entry) => wishlistItemId(entry) === itemId && entry.itemType === itemType,
  );

  function toggleWishlist() {
    if (disabled || isPending) return;
    toggleWishlistItem({ itemId, itemType });
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
