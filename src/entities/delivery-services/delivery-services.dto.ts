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
  cityLeadDays: number;
  outsideCityLeadDays: number;
  pricePerKilometerInCity: number;
  pricePerKilometer: number;
  isEnable: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryAvailabilityTimeDTO = {
  start: number | string;
  end: number | string;
};

export type DeliveryAvailabilityDayDTO = {
  weekday: string;
  weekday_fa: string;
  date: string;
  month_ja: number;
  day_ja: number;
  availableTimes: DeliveryAvailabilityTimeDTO[];
};

/** Public quote responses intentionally exclude provider pricing inputs and origin coordinates. */
export type AvailableDeliveryServiceDTO = {
  id: string;
  title: string;
  title_fa: string;
  logo: string;
  packingPrice: number;
  availability: DeliveryAvailabilityDayDTO[];
  distanceKm: number;
  calculatedPricePerKilometer: number;
};

export type DeliveryServiceIdDTO = DeliveryServiceIdInput;
export type DeliveryServiceQueryDTO = DeliveryServiceQueryInput;
export type AvailableDeliveryServicesQueryDTO = AvailableDeliveryServicesQueryInput;
export type CreateDeliveryServiceDTO = DeliveryServiceInput;
export type UpdateDeliveryServiceDTO = UpdateDeliveryServiceInput;
export type DeleteDeliveryServiceResultDTO = { id: string };
