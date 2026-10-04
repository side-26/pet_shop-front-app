import type { CartItemDetailsDTO } from '@/entities/users/users.dto';

export type CartPrices = Readonly<{
  productPrice: number;
  discountPrice: number;
}>;

export function calculateCartPrices(items: readonly CartItemDetailsDTO[]): CartPrices {
  return items.reduce(
    (totals, item) => ({
      productPrice: totals.productPrice + item.price * item.cartQuantity,
      // The API already calculates the discount for the entire cart line.
      discountPrice: totals.discountPrice + item.discountPrice,
    }),
    { productPrice: 0, discountPrice: 0 },
  );
}
