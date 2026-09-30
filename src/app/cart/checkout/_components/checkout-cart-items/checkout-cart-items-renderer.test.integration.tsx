import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { CartItemDetailsDTO } from '@/entities/users/users.dto';

import { CheckoutCartItemsRenderer } from './checkout-cart-items-renderer';
import { checkoutCartItemsSkeletonData } from './checkout-cart-items-skeleton-data';

const cartItems: readonly CartItemDetailsDTO[] = [
  {
    id: 'line-1',
    itemId: 'product-1',
    itemType: 'product',
    title: 'غذای خشک گربه',
    mainImage: 'https://cdn.example.test/cat-food.webp',
    mainThumbnailImage: 'https://cdn.example.test/cat-food-thumbnail.webp',
    weight: null,
    cartQuantity: 2,
    discountPrice: 100_000,
    price: 120_000,
    productAllowQuantity: 4,
  },
];

afterEach(cleanup);

describe('CheckoutCartItemsRenderer', () => {
  it('renders each cart item with its title, image alt text, and quantity badge', () => {
    render(<CheckoutCartItemsRenderer items={cartItems} />);

    expect(screen.getByRole('img', { name: 'غذای خشک گربه' })).toBeTruthy();
    expect(screen.getByText('غذای خشک گربه')).toBeTruthy();
    expect(screen.getByText('۲ عدد')).toBeTruthy();
  });

  it('uses the same renderer for the inaccessible streaming skeleton', () => {
    const { container } = render(
      <CheckoutCartItemsRenderer isSkeleton items={checkoutCartItemsSkeletonData} />,
    );

    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.getByLabelText('در حال دریافت کالاهای سفارش').getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(screen.queryByRole('img')).toBeNull();
  });
});
