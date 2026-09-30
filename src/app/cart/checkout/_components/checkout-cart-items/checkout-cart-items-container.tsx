import type { getCartItemDetailsAction } from '@/entities/users/users.actions';

import { CheckoutCartItemsEmpty } from './checkout-cart-items-empty';
import { CheckoutCartItemsFetchError } from './checkout-cart-items-fetch-error';
import { CheckoutCartItemsRenderer } from './checkout-cart-items-renderer';

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

  return <CheckoutCartItemsRenderer items={result.data} />;
}
