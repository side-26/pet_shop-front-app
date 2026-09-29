import { Suspense } from 'react';

import { getProfileAddressesAction } from '@/entities/profile/profile.actions';

import { CheckoutAddressSelectionContainer } from './address-selection-container';
import { CheckoutAddressSelectionErrorBoundary } from './address-selection-error-boundary';
import { CheckoutAddressSelectionRenderer } from './address-selection-renderer';
import { checkoutAddressSelectionSkeletonData } from './address-selection-skeleton-data';

export function CheckoutAddressSelection() {
  const addressesPromise = getProfileAddressesAction();

  return (
    <Suspense
      fallback={
        <CheckoutAddressSelectionRenderer
          addresses={checkoutAddressSelectionSkeletonData}
          isSkeleton
        />
      }
    >
      <CheckoutAddressSelectionErrorBoundary>
        <CheckoutAddressSelectionContainer addressesPromise={addressesPromise} />
      </CheckoutAddressSelectionErrorBoundary>
    </Suspense>
  );
}
