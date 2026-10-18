'use client';

import { Heart, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useWishlist, useWishlistToggle, wishlistItemId } from '@/entities/users/users.client';
import { useShare } from '@/hooks/use-share';

type PetHeaderActionsProps = Readonly<{
  disabled?: boolean;
  petId: string;
  title: string;
}>;

export function PetHeaderActions({ disabled, petId, title }: PetHeaderActionsProps) {
  const { share, status: shareStatus } = useShare({
    copiedMessage: 'پیوند حیوان کپی شد',
    title,
  });
  const { data: wishlist = [] } = useWishlist({ enabled: !disabled });
  const { isPending, toggleWishlistItem } = useWishlistToggle();
  const isWishlisted = wishlist.some(
    (entry) => wishlistItemId(entry) === petId && entry.itemType === 'pet',
  );

  function toggleWishlist() {
    if (disabled || isPending) return;
    toggleWishlistItem({ itemId: petId, itemType: 'pet' });
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
        onClick={() => void share()}
      >
        <Share2 aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {shareStatus}
      </span>
    </div>
  );
}
