'use client';

import { Heart } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { useWishlist, useWishlistToggle, wishlistItemId } from '@/entities/users/users.client';

type PetWishlistToggleProps = Readonly<{
  disabled?: boolean;
  petId: string;
  petTitle: string;
}>;

export function PetWishlistToggle({ disabled = false, petId, petTitle }: PetWishlistToggleProps) {
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
    <Toggle
      iconOnly
      size="sm"
      variant="transparent"
      color="error"
      disabled={disabled || isPending}
      aria-label={`افزودن ${petTitle} به علاقه‌مندی‌ها`}
      pressed={isWishlisted}
      onPressedChange={toggleWishlist}
      className="tw:absolute tw:end-2 tw:top-2"
    >
      <Heart
        aria-hidden="true"
        className="tw:transition-[fill] tw:group-data-pressed/toggle:fill-current"
      />
    </Toggle>
  );
}
