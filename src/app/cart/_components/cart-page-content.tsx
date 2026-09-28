import type { CartItem } from './cart-data';
import { CartOrder } from './cart-order';

export function CartPageContent({
  initialItems = [],
  isSkeleton = false,
}: Readonly<{ initialItems?: readonly CartItem[]; isSkeleton?: boolean }>) {
  const cartOrderKey = isSkeleton
    ? 'cart-skeleton'
    : initialItems
        .map(
          (item) =>
            `${item.id}:${item.quantity}:${item.price}:${item.previousPrice ?? ''}:${item.stock}`,
        )
        .join('|');

  return (
    <div
      data-cart-page
      className="tw:relative tw:flex-1 tw:overflow-hidden tw:p-3 tw:pb-24 tw:sm:p-4 tw:sm:pb-28 tw:lg:h-full tw:lg:p-6 tw:lg:[--text-heading-2:1.5rem] tw:lg:[--text-title-l:1rem] tw:lg:[--text-title-m:0.875rem] tw:lg:[--text-title-s:0.8125rem] tw:lg:[--text-body-m:0.8125rem] tw:lg:[--text-body-s:0.75rem] tw:lg:[--text-label-l:0.8125rem] tw:lg:[--text-label-m:0.75rem] tw:lg:[--text-price-m:1rem] tw:lg:[--text-price-s:0.875rem]"
    >
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-72 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_62%)] tw:opacity-70"
      />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-[1440px] tw:flex-col tw:gap-4 tw:lg:h-full tw:lg:min-h-0">
        <CartOrder key={cartOrderKey} initialItems={initialItems} isSkeleton={isSkeleton} />
      </div>
    </div>
  );
}
