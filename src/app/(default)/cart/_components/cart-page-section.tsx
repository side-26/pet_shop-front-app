import { Suspense } from 'react';
import { getCartAction } from '@/entities/users/users.actions';
import { createCartItems } from './cart-data';
import { CartPageContent } from './cart-page-content';

async function CartPageContainer({
  cartPromise,
}: Readonly<{ cartPromise: ReturnType<typeof getCartAction> }>) {
  const result = await cartPromise;
  if (!result.isSuccess) throw new Error(result.message ?? 'دریافت سبد خرید انجام نشد.');

  return <CartPageContent initialItems={createCartItems(result.data.items)} />;
}

export function CartPageSection() {
  const cartPromise = getCartAction();
  return (
    <Suspense fallback={<CartPageContent isSkeleton />}>
      <CartPageContainer cartPromise={cartPromise} />
    </Suspense>
  );
}
