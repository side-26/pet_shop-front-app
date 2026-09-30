import { Suspense } from 'react';

import { getCartItemDetailsAction } from '@/entities/users/users.actions';

import { CheckoutCartItemsContainer } from './checkout-cart-items-container';
import { CheckoutCartItemsErrorBoundary } from './checkout-cart-items-error-boundary';
import { CheckoutCartItemsRenderer } from './checkout-cart-items-renderer';
import { checkoutCartItemsSkeletonData } from './checkout-cart-items-skeleton-data';

export function CheckoutCartItems() {
  const cartItemsPromise = getCartItemDetailsAction();

  return (
    <Suspense
      fallback={<CheckoutCartItemsRenderer isSkeleton items={checkoutCartItemsSkeletonData} />}
    >
      <CheckoutCartItemsErrorBoundary>
        <CheckoutCartItemsContainer cartItemsPromise={cartItemsPromise} />
      </CheckoutCartItemsErrorBoundary>
    </Suspense>
  );
}
