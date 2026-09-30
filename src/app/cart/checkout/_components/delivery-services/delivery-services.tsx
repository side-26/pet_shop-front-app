'use client';

import { lazy, Suspense } from 'react';

import { CheckoutDeliveryServicesErrorBoundary } from './delivery-services-error-boundary';
import { CheckoutDeliveryServicesRenderer } from './delivery-services-renderer';
import { checkoutDeliveryServicesSkeletonData } from './delivery-services-skeleton-data';

const CheckoutDeliveryServicesClientContainer = lazy(async () => {
  const loaded = await import('./delivery-services-client-container');
  return { default: loaded.CheckoutDeliveryServicesClientContainer };
});

/** Coordinates live in the client checkout store, so the section starts its request after hydration. */
export function CheckoutDeliveryServices() {
  return (
    <Suspense
      fallback={
        <CheckoutDeliveryServicesRenderer
          hasSelectedAddress
          isSkeleton
          services={checkoutDeliveryServicesSkeletonData}
        />
      }
    >
      <CheckoutDeliveryServicesErrorBoundary>
        <CheckoutDeliveryServicesClientContainer />
      </CheckoutDeliveryServicesErrorBoundary>
    </Suspense>
  );
}
