import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { LandingWishlistItemDTO } from '@/entities/landing/landing.dto';

import { WishListEmptyFetch } from './wish-list-empty-fetch';
import { mapWishListItems } from './wish-list.mapper';
import { WishListRenderer } from './wish-list-renderer';

type WishListContentProps = Readonly<{
  wishListPromise: Promise<LandingWishlistItemDTO[]>;
}>;

export function WishListContent({ wishListPromise }: WishListContentProps) {
  const wishList = use(wishListPromise);

  return (
    <EmptyStateBoundary
      data={wishList}
      fallback={<WishListEmptyFetch />}
      isEmpty={() => wishList.length === 0}
    >
      <WishListRenderer items={mapWishListItems(wishList)} />
    </EmptyStateBoundary>
  );
}
