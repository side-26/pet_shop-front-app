import type { CheckoutDeliveryServiceViewModel } from './delivery-services.types';

export const checkoutDeliveryServicesSkeletonData: readonly CheckoutDeliveryServiceViewModel[] =
  Array.from({ length: 2 }, (_, index) => ({
    id: `checkout-delivery-service-skeleton-${index}`,
    title: '',
    title_fa: '',
    logo: '',
    packingPrice: 0,
    availability: [],
    distanceKm: 0,
    calculatedPricePerKilometer: 0,
  }));
