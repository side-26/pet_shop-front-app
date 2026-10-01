'use client';

import type { ReactNode } from 'react';

import { useCheckoutStore } from '@/stores/checkout.store';

import type { CheckoutAddressViewModel } from './address-selection.types';

type CheckoutAddressSelectionRenderProps = Readonly<{
  selectedAddressId?: string;
  onValueChange: (addressId: string) => void;
}>;

export function CheckoutAddressSelection({
  addresses,
  children,
}: Readonly<{
  addresses: readonly CheckoutAddressViewModel[];
  children: (props: CheckoutAddressSelectionRenderProps) => ReactNode;
}>) {
  const selectedAddressId = useCheckoutStore((state) => state.checkoutInformation.addressId);
  const selectAddress = useCheckoutStore((state) => state.selectAddress);

  function selectCheckoutAddress(addressId: string) {
    const address = addresses.find((item) => item.id === addressId);
    if (address) selectAddress(address);
  }

  return children({ selectedAddressId, onValueChange: selectCheckoutAddress });
}
