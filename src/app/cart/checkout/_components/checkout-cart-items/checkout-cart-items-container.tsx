import type { getCartItemDetailsAction } from '@/entities/users/users.actions';
import { calculateCartPrices } from '@/entities/cart/cart.helper';

import { CheckoutCartItemsEmpty } from './checkout-cart-items-empty';
import { CheckoutCartItemsFetchError } from './checkout-cart-items-fetch-error';
import { CheckoutCartItemsRenderer } from './checkout-cart-items-renderer';
import { CheckoutCartPriceSynchronizer } from './checkout-cart-price-synchronizer';

type CheckoutCartItemsContainerProps = Readonly<{
  cartItemsPromise: ReturnType<typeof getCartItemDetailsAction>;
}>;

export async function CheckoutCartItemsContainer({
  cartItemsPromise,
}: CheckoutCartItemsContainerProps) {
  const result = await cartItemsPromise;

  if (!result.isSuccess) {
    return <CheckoutCartItemsFetchError description={result.message} />;
  }

  if (!result.data.length) {
    return <CheckoutCartItemsEmpty />;
  }

  const prices = calculateCartPrices(result.data);

  return (
    <>
      <CheckoutCartPriceSynchronizer prices={prices} />
      <CheckoutCartItemsRenderer items={result.data} />
    </>
  );
}
