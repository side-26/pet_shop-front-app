import type { CheckoutAddressViewModel } from './address-selection.types';

export const checkoutAddressSelectionSkeletonData: readonly CheckoutAddressViewModel[] = Array.from(
  { length: 2 },
  (_, index) => ({
    id: `checkout-address-skeleton-${index}`,
    title: '',
    address: '',
    recipient: '',
    phone: '',
    postalCode: '',
  }),
);
