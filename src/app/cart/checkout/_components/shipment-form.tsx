import { CheckoutAddressSelection } from './address-selection/address-selection';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { CheckoutDeliveryServices } from './delivery-services/delivery-services';
import { DeliveryTime } from './delivery-time/delivery-time';

export function ShipmentForm() {
  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:xl:gap-8">
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-6">
        <CheckoutAddressSelection />
        <CheckoutDeliveryServices />
        <DeliveryTime />
      </div>

      <CheckoutOrderSummary />
    </div>
  );
}
