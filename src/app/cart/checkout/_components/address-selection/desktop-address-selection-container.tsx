import type { getProfileAddressesAction } from '@/entities/profile/profile.actions';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryProfileAddressesAction } from '@/entities/profile/profile.actions';

import { mapCheckoutAddresses } from './address-selection.mapper';
import { DesktopAddressSelectionRenderer } from './desktop-address-selection-renderer';

export async function DesktopAddressSelectionContainer({
  addressesPromise,
}: Readonly<{ addressesPromise: ReturnType<typeof getProfileAddressesAction> }>) {
  const result = await addressesPromise;

  if (!result?.isSuccess) {
    return (
      <FetchErrorSectionBoundary
        description={result?.message ?? undefined}
        onRetry={retryProfileAddressesAction}
        title="دریافت نشانی‌ها انجام نشد"
      />
    );
  }

  return <DesktopAddressSelectionRenderer addresses={mapCheckoutAddresses(result.data)} />;
}
