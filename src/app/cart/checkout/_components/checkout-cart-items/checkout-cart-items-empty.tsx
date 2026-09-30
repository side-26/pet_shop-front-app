import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export function CheckoutCartItemsEmpty() {
  return (
    <Empty className="tw:border">
      <EmptyHeader>
        <EmptyTitle>سبد خرید شما خالی است</EmptyTitle>
        <EmptyDescription>
          برای ادامه سفارش، کالا یا حیوان خانگی به سبد خرید اضافه کنید.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
