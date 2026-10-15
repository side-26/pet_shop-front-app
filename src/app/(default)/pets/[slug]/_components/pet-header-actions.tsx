'use client';

import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useWishlist, useWishlistToggle, wishlistItemId } from '@/entities/users/users.client';

type PetHeaderActionsProps = Readonly<{
  disabled?: boolean;
  petId: string;
  title: string;
}>;

export function PetHeaderActions({ disabled, petId, title }: PetHeaderActionsProps) {
  const [shareStatus, setShareStatus] = useState('');
  const { data: wishlist = [] } = useWishlist({ enabled: !disabled });
  const { isPending, toggleWishlistItem } = useWishlistToggle();
  const isWishlisted = wishlist.some(
    (entry) => wishlistItemId(entry) === petId && entry.itemType === 'pet',
  );

  function toggleWishlist() {
    if (disabled || isPending) return;
    toggleWishlistItem({ itemId: petId, itemType: 'pet' });
  }

  async function sharePet() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }

      await navigator.clipboard?.writeText(window.location.href);
      setShareStatus('پیوند حیوان کپی شد');
    } catch {
      setShareStatus('اشتراک‌گذاری لغو شد');
    }
  }

  return (
    <div className="tw:flex tw:items-center tw:gap-1">
      <Toggle
        disabled={disabled || isPending}
        iconOnly
        size="md"
        variant="flat"
        color="error"
        aria-label={`افزودن حیوان ${title} به علاقه‌مندی‌ها`}
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
        aria-label={`اشتراک‌گذاری حیوان ${title}`}
        disabled={disabled}
        onClick={() => void sharePet()}
      >
        <Share2 aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {shareStatus}
      </span>
    </div>
  );
}
