import type { LandingWishlistItemDTO } from '@/entities/landing/landing.dto';

import type { WishListItemViewModel } from './wish-list.types';

export function mapWishListItems(
  items: readonly LandingWishlistItemDTO[],
): WishListItemViewModel[] {
  return items.map(({ id, item, itemType }) => ({
    id,
    itemType,
    title: item.title,
    mainImage: item.mainImage,
    thumbnailImage: item.mainImageThumbnail,
  }));
}
