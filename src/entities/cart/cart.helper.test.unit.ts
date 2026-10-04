import { describe, expect, it } from 'vitest';

import type { CartItemDetailsDTO } from '@/entities/users/users.dto';

import { calculateCartPrices } from './cart.helper';

describe('calculateCartPrices', () => {
  it('multiplies the per-unit price but does not duplicate the cart-line discount', () => {
    const items: readonly CartItemDetailsDTO[] = [
      {
        id: 'line-1',
        itemId: 'product-1',
        itemType: 'product',
        title: 'غذای خشک',
        mainImage: 'https://cdn.example.test/product.webp',
        mainThumbnailImage: 'https://cdn.example.test/product-thumbnail.webp',
        weight: null,
        cartQuantity: 2,
        price: 100_000,
        discountPrice: 20_000,
        productAllowQuantity: 4,
      },
    ];

    expect(calculateCartPrices(items)).toEqual({
      productPrice: 200_000,
      discountPrice: 20_000,
    });
  });
});
