'use client';

import { useAvailableDeliveryServices } from '@/entities/delivery-services/delivery-services.client';
import { useCheckoutStore } from '@/stores/checkout.store';

import { CheckoutDeliveryServicesFetchError } from './delivery-services-fetch-error';
import { CheckoutDeliveryServicesRenderer } from './delivery-services-renderer';
import { checkoutDeliveryServicesSkeletonData } from './delivery-services-skeleton-data';

export function CheckoutDeliveryServicesClientContainer() {
  const coordinates = useCheckoutStore((state) => state.selectedAddressCoordinates);
  const query = useAvailableDeliveryServices(
    coordinates ? { lat: coordinates[0], lng: coordinates[1] } : null,
  );

  if (coordinates === null) {
    return <CheckoutDeliveryServicesRenderer hasSelectedAddress={false} services={[]} />;
  }

  if (query.isError) {
    return (
      <CheckoutDeliveryServicesFetchError
        description={query.error.message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (query.isPending) {
    return (
      <CheckoutDeliveryServicesRenderer
        hasSelectedAddress
        isSkeleton
        services={checkoutDeliveryServicesSkeletonData}
      />
    );
  }

  return <CheckoutDeliveryServicesRenderer hasSelectedAddress services={query.data ?? []} />;
}
