import type {
  AvailableDeliveryServicesQueryInput,
  DeliveryServiceAvailabilityInput,
  DeliveryServiceIdInput,
  DeliveryServiceInput,
  DeliveryServiceQueryInput,
  UpdateDeliveryServiceInput,
} from './delivery-services.schema';

export type DeliveryServiceDTO = {
  id: string;
  title: string;
  title_fa: string;
  logo: string;
  originCoordinates: [number, number];
  availability: DeliveryServiceAvailabilityInput;
  basePrice: number;
  packingPrice: number;
  pricePerKilometerInCity: number;
  pricePerKilometer: number;
  isEnable: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryAvailabilitySlotDTO = {
  weekday: string;
  startsAt: string;
  endsAt: string;
};

export type AvailableDeliveryServiceDTO = Omit<DeliveryServiceDTO, 'availability'> & {
  availability: DeliveryAvailabilitySlotDTO[];
  distanceKm: number;
  shippingPrice: number;
};

export type DeliveryServiceIdDTO = DeliveryServiceIdInput;
export type DeliveryServiceQueryDTO = DeliveryServiceQueryInput;
export type AvailableDeliveryServicesQueryDTO = AvailableDeliveryServicesQueryInput;
export type CreateDeliveryServiceDTO = DeliveryServiceInput;
export type UpdateDeliveryServiceDTO = UpdateDeliveryServiceInput;
export type DeleteDeliveryServiceResultDTO = { id: string };
