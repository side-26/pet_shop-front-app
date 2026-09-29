import type { getProfileAddressesAction } from '@/entities/profile/profile.actions';

import { CheckoutAddressSelectionFetchError } from './address-selection-fetch-error';
import { mapCheckoutAddresses } from './address-selection.mapper';
import { CheckoutAddressSelectionRenderer } from './address-selection-renderer';

type Props = Readonly<{ addressesPromise: ReturnType<typeof getProfileAddressesAction> }>;

export async function CheckoutAddressSelectionContainer({ addressesPromise }: Props) {
  const result = await addressesPromise;

  if (!result?.isSuccess) {
    return <CheckoutAddressSelectionFetchError description={result?.message} />;
  }

  return <CheckoutAddressSelectionRenderer addresses={mapCheckoutAddresses(result.data)} />;
}
