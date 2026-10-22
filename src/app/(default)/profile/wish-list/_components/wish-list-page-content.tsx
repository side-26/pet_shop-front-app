import { getLandingWishlistAction } from '@/entities/landing/landing.actions';

import { WishListContent } from './wish-list-content';

/** The private cache prevents user-specific wishlist markup from entering the shared cache. */
export async function WishListPageContent() {
  'use cache: private';

  const wishListPromise = getLandingWishlistAction();
  return <WishListContent wishListPromise={wishListPromise} />;
}
