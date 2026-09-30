import type { ReactNode } from 'react';

import { CheckoutOrderSummary } from './checkout-order-summary';
import { DeliveryTime } from './delivery-time/delivery-time';

type ShipmentFormProps = Readonly<{
  addressSelection: ReactNode;
  deliveryServicesSelection: ReactNode;
}>;

export function ShipmentForm({ addressSelection, deliveryServicesSelection }: ShipmentFormProps) {
  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:xl:gap-8">
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-6">
        {addressSelection}
        {deliveryServicesSelection}
        <DeliveryTime />
      </div>

      <CheckoutOrderSummary />
    </div>
  );
}
