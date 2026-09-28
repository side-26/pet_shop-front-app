import { expect, it } from 'vitest';

import { createCartItems } from './cart-data';

it('maps populated /cart/all entries to weight-specific cart lines', () => {
  const items = createCartItems([
    {
      _id: 'cart-entry-1',
      itemType: 'product',
      quantity: 2,
      weight: 'weight-1',
      item: {
        _id: 'product-1',
        title: 'غذای خشک سگ',
        mainImage: '/product.jpg',
        mainImageThumbnail: 'data:image/webp;base64,AAAA',
        price: 900_000,
        discountPercentage: 0,
        weights: [
          {
            id: 'weight-1',
            value: 2,
            metric: 'کیلوگرم',
            quantity: 3,
            price: 800_000,
            discountPercentage: 10,
          },
        ],
      },
    },
  ]);

  expect(items).toEqual([
    expect.objectContaining({
      id: 'cart-entry-1',
      title: 'غذای خشک سگ',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      detail: '2 کیلوگرم',
      price: 720_000,
      previousPrice: 800_000,
      quantity: 2,
      stock: 3,
      cartItem: expect.objectContaining({
        type: 'product',
        productId: 'product-1',
        cartEntryId: 'cart-entry-1',
      }),
    }),
  ]);
});
