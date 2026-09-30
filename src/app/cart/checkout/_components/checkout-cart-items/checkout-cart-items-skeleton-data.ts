import type { CartItemDetailsDTO } from '@/entities/users/users.dto';

export const checkoutCartItemsSkeletonData: readonly CartItemDetailsDTO[] = Array.from(
  { length: 3 },
  (_, index) => ({
    id: 'checkout-cart-item-skeleton-' + index,
    itemId: '',
    itemType: 'product',
    title: '',
    mainImage: '',
    mainThumbnailImage: '',
    weight: null,
    cartQuantity: 0,
    discountPrice: 0,
    price: 0,
    productAllowQuantity: 0,
  }),
);
