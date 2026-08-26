import { Check, CreditCard, MapPin, Truck, type LucideIcon } from 'lucide-react';

import {
  checkoutAddresses,
  checkoutItems,
  checkoutTotals,
  deliveryDates,
  deliveryMethods,
  deliveryTimeSlots,
} from './checkout-data';
import { ShipmentForm } from './shipment-form';

type CheckoutStep = Readonly<{
  label: string;
  icon: LucideIcon;
  complete?: boolean;
  current?: boolean;
}>;

const steps: readonly CheckoutStep[] = [
  { label: 'سبد خرید', icon: Check, complete: true },
  { label: 'ارسال و تحویل', icon: Truck, current: true },
  { label: 'پرداخت', icon: CreditCard },
];

export function CheckoutPageContent() {
  return (
    <div className="tw:relative tw:overflow-clip tw:py-7 tw:sm:py-10 tw:lg:py-14 tw:[--text-heading-2:1.375rem] tw:[--text-title-l:0.9375rem] tw:[--text-title-m:0.875rem] tw:[--text-title-s:0.8125rem] tw:[--text-body-m:0.8125rem] tw:[--text-body-s:0.75rem] tw:[--text-label-l:0.8125rem] tw:[--text-label-m:0.75rem] tw:[--text-price-m:1rem] tw:[--text-price-s:0.875rem]">
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-72 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_62%)] tw:opacity-70"
      />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-6 tw:px-4 tw:sm:gap-8 tw:sm:px-6 tw:lg:px-8">
        <header className="tw:flex tw:flex-col tw:gap-5">
          <div className="tw:flex tw:items-center tw:gap-3">
            <span className="tw:flex tw:size-10 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary">
              <MapPin aria-hidden="true" className="tw:size-5" />
            </span>
            <div>
              <h1 className="tw:text-heading-2 tw:text-foreground">ارسال و تحویل سفارش</h1>
              <p className="tw:text-body-s tw:text-muted-foreground">
                نشانی و روش تحویل سفارش را انتخاب کنید.
              </p>
            </div>
          </div>

          <ol aria-label="مراحل ثبت سفارش" className="tw:grid tw:grid-cols-3 tw:gap-2 tw:sm:gap-4">
            {steps.map((step, index) => (
              <li
                key={step.label}
                aria-current={step.current ? 'step' : undefined}
                className="tw:flex tw:min-w-0 tw:items-center tw:gap-2 tw:sm:gap-3"
              >
                <span
                  className={
                    step.complete || step.current
                      ? 'tw:flex tw:size-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-primary tw:text-primary-foreground tw:sm:size-10'
                      : 'tw:flex tw:size-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-muted tw:text-muted-foreground tw:sm:size-10'
                  }
                >
                  <step.icon aria-hidden="true" className="tw:size-4 tw:sm:size-5" />
                </span>
                <span
                  className={
                    step.current
                      ? 'tw:truncate tw:text-label-m tw:text-primary tw:sm:text-label-l'
                      : 'tw:truncate tw:text-label-m tw:text-muted-foreground tw:sm:text-label-l'
                  }
                >
                  {step.label}
                </span>
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="tw:hidden tw:h-px tw:min-w-5 tw:flex-1 tw:bg-border tw:sm:block"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </header>

        <ShipmentForm
          addresses={checkoutAddresses}
          deliveryDates={deliveryDates}
          deliveryMethods={deliveryMethods}
          deliveryTimeSlots={deliveryTimeSlots}
          items={checkoutItems}
          totals={checkoutTotals}
        />
      </div>
    </div>
  );
}
