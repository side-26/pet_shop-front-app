import { MapPin } from 'lucide-react';

import { CheckoutAddressSelection } from './address-selection/address-selection';
import { CheckoutDeliveryServices } from './delivery-services/delivery-services';
import { ShipmentForm } from './shipment-form';

export function CheckoutPageContent() {
  return (
    <div className="tw:relative tw:overflow-clip tw:py-7 tw:sm:py-10 tw:lg:py-14 tw:[--text-heading-2:1.375rem] tw:[--text-title-l:0.9375rem] tw:[--text-title-m:0.875rem] tw:[--text-title-s:0.8125rem] tw:[--text-body-m:0.8125rem] tw:[--text-body-s:0.75rem] tw:[--text-label-l:0.8125rem] tw:[--text-label-m:0.75rem] tw:[--text-price-m:1rem] tw:[--text-price-s:0.875rem]">
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-72 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_62%)] tw:opacity-70"
      />
      <div className="tw:default-layout-container tw:flex tw:flex-col tw:gap-6 tw:sm:gap-8">
        <header>
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
        </header>

        <ShipmentForm
          addressSelection={<CheckoutAddressSelection />}
          deliveryServicesSelection={<CheckoutDeliveryServices />}
        />
      </div>
    </div>
  );
}
