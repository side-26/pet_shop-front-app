import { FetchErrorSection } from '@/components/common/fetch-error-section';
import {
  getProfileAddressesAction,
  retryProfileAddressesAction,
} from '@/entities/profile/profile.actions';

import { mapCheckoutAddresses } from './address-selection.mapper';
import { CheckoutAddressDrawerListComposer } from './checkout-address-drawer-list-composer';

export async function CheckoutAddressDrawerList() {
  const result = await getProfileAddressesAction();

  if (!result?.isSuccess) {
    return (
      <FetchErrorSection
        description={result?.message ?? undefined}
        onRetry={retryProfileAddressesAction}
        title="دریافت نشانی‌ها انجام نشد"
      />
    );
  }

  return <CheckoutAddressDrawerListComposer addresses={mapCheckoutAddresses(result.data)} />;
}
