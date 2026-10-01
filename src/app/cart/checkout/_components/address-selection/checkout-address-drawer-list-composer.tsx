'use client';

import { CheckoutAddressDrawerListRenderer } from './checkout-address-drawer-list-renderer';
import { CheckoutAddressSelection } from './checkout-address-selection';
import type { CheckoutAddressViewModel } from './address-selection.types';

export function CheckoutAddressDrawerListComposer({
  addresses,
}: Readonly<{ addresses: readonly CheckoutAddressViewModel[] }>) {
  return (
    <CheckoutAddressSelection addresses={addresses}>
      {({ selectedAddressId, onValueChange }) => (
        <CheckoutAddressDrawerListRenderer
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onValueChange={onValueChange}
        />
      )}
    </CheckoutAddressSelection>
  );
}
