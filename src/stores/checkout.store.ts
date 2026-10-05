'use client';

import { create } from 'zustand';

import type { DeliveryAvailabilityDayDTO } from '@/entities/delivery-services/delivery-services.dto';

export type CheckoutAddressCoordinates = readonly [latitude: number, longitude: number];

export type CheckoutSelectedAddress = Readonly<{
  id: string;
  title: string;
  address: string;
  recipient: string;
  phone: string;
  postalCode: string;
  latLng: CheckoutAddressCoordinates;
}>;

/** The public delivery-service availability response is retained without reshaping its day groups. */
export type CheckoutDeliveryAvailability = DeliveryAvailabilityDayDTO;

export type CheckoutDeliveryDate = Readonly<{
  id: string;
  weekday: string;
}>;

export type CheckoutDeliveryTimeSlot = Readonly<{
  id: string;
  label: string;
  description: string;
  weekday?: string;
  startsAt?: string;
  endsAt?: string;
}>;

/** Values retained only for the active checkout journey and supplied to checkout/order actions. */
export type CheckoutInformation = Readonly<{
  addressId?: string;
  deliveryServiceId?: string;
  deliveryServiceAvailability?: readonly CheckoutDeliveryAvailability[];
  deliveryDate?: CheckoutDeliveryDate;
  deliveryTimeSlot?: CheckoutDeliveryTimeSlot;
  deliveryQuoteId?: string;
  deliveryWindowId?: string;
  paymentTrackingId?: string;
}>;

type CheckoutStore = {
  selectedAddressCoordinates: CheckoutAddressCoordinates | null;
  selectedAddress: CheckoutSelectedAddress | null;
  checkoutInformation: CheckoutInformation;

  setSelectedAddressCoordinates: (coordinates: CheckoutAddressCoordinates | null) => void;
  getSelectedAddressCoordinates: () => CheckoutAddressCoordinates | null;
  selectAddress: (address: CheckoutSelectedAddress) => void;
  saveCheckoutInformation: (information: Partial<CheckoutInformation>) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  selectedAddressCoordinates: null,
  selectedAddress: null,
  checkoutInformation: {},

  setSelectedAddressCoordinates: (selectedAddressCoordinates) =>
    set({ selectedAddressCoordinates }),
  getSelectedAddressCoordinates: () => get().selectedAddressCoordinates,
  selectAddress: (selectedAddress) =>
    set((state) => ({
      selectedAddressCoordinates: selectedAddress.latLng,
      selectedAddress,
      checkoutInformation: { ...state.checkoutInformation, addressId: selectedAddress.id },
    })),
  saveCheckoutInformation: (information) =>
    set((state) => ({
      checkoutInformation: { ...state.checkoutInformation, ...information },
    })),
  clearCheckout: () =>
    set({
      selectedAddressCoordinates: null,
      selectedAddress: null,
      checkoutInformation: {},
    }),
}));
