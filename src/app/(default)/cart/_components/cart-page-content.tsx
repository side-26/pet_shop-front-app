import { initialCartItems } from './cart-data';
import { CartOrder } from './cart-order';

export function CartPageContent() {
  return (
    <div
      data-cart-page
      className="tw:relative tw:overflow-hidden tw:py-7 tw:sm:py-10 tw:lg:h-full tw:lg:py-8 tw:lg:[--text-heading-2:1.5rem] tw:lg:[--text-title-l:1rem] tw:lg:[--text-title-m:0.875rem] tw:lg:[--text-title-s:0.8125rem] tw:lg:[--text-body-m:0.8125rem] tw:lg:[--text-body-s:0.75rem] tw:lg:[--text-label-l:0.8125rem] tw:lg:[--text-label-m:0.75rem] tw:lg:[--text-price-m:1rem] tw:lg:[--text-price-s:0.875rem]"
    >
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-72 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_62%)] tw:opacity-70"
      />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-6 tw:px-4 tw:sm:px-6 tw:lg:h-full tw:lg:min-h-0 tw:lg:gap-4 tw:lg:px-8">
        <header>
          <h1 className="tw:text-heading-2 tw:text-foreground">سبد خرید</h1>
        </header>
        <CartOrder initialItems={initialCartItems} />
      </div>
    </div>
  );
}
