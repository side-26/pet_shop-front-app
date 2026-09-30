'use client';

import { create } from 'zustand';

export type CheckoutPriceLine = Readonly<{
  price: number;
  discountPercentage: number;
  quantity: number;
}>;

export type CheckoutPrices = Readonly<{
  itemsPrice: number;
  discountPrice: number;
  shippingPrice: number;
  payablePrice: number;
}>;

export type CheckoutAddressCoordinates = readonly [latitude: number, longitude: number];

export type CheckoutDeliveryAvailability = Readonly<{
  weekday: string;
  startsAt: string;
  endsAt: string;
}>;

export type CheckoutDeliveryDate = Readonly<{
  id: string;
  weekday: string;
  date: string;
  recommended?: boolean;
}>;

export type CheckoutDeliveryTimeSlot = Readonly<{
  id: string;
  label: string;
  description: string;
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

const initialPrices: CheckoutPrices = {
  itemsPrice: 0,
  discountPrice: 0,
  shippingPrice: 0,
  payablePrice: 0,
};

function isNonNegativeFiniteNumber(value: number) {
  return Number.isFinite(value) && value >= 0;
}

function isPositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0;
}

/** Matches backend cart pricing: gross line total minus percentage discount, plus shipping. */
export function calculateCheckoutPrices(
  lines: readonly CheckoutPriceLine[],
  shippingPrice = 0,
): CheckoutPrices {
  if (!isNonNegativeFiniteNumber(shippingPrice)) {
    throw new Error('Shipping price must be a non-negative finite number.');
  }

  const { itemsPrice, discountPrice } = lines.reduce(
    (totals, line) => {
      if (!isNonNegativeFiniteNumber(line.price)) {
        throw new Error('Checkout line price must be a non-negative finite number.');
      }
      if (!isNonNegativeFiniteNumber(line.discountPercentage) || line.discountPercentage > 100) {
        throw new Error('Checkout line discount percentage must be between zero and 100.');
      }
      if (!isPositiveInteger(line.quantity)) {
        throw new Error('Checkout line quantity must be a positive integer.');
      }

      const linePrice = line.price * line.quantity;
      return {
        itemsPrice: totals.itemsPrice + linePrice,
        discountPrice: totals.discountPrice + linePrice * (line.discountPercentage / 100),
      };
    },
    { itemsPrice: 0, discountPrice: 0 },
  );

  return {
    itemsPrice,
    discountPrice,
    shippingPrice,
    payablePrice: itemsPrice - discountPrice + shippingPrice,
  };
}

type CheckoutStore = {
  prices: CheckoutPrices;
  selectedAddressCoordinates: CheckoutAddressCoordinates | null;
  checkoutInformation: CheckoutInformation;

  calculatePrices: (lines: readonly CheckoutPriceLine[], shippingPrice?: number) => CheckoutPrices;
  setSelectedAddressCoordinates: (coordinates: CheckoutAddressCoordinates | null) => void;
  getSelectedAddressCoordinates: () => CheckoutAddressCoordinates | null;
  selectAddress: (addressId: string, coordinates: CheckoutAddressCoordinates) => void;
  saveCheckoutInformation: (information: Partial<CheckoutInformation>) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  prices: initialPrices,
  selectedAddressCoordinates: null,
  checkoutInformation: {},

  calculatePrices: (lines, shippingPrice = 0) => {
    const prices = calculateCheckoutPrices(lines, shippingPrice);
    set({ prices });
    return prices;
  },
  setSelectedAddressCoordinates: (selectedAddressCoordinates) =>
    set({ selectedAddressCoordinates }),
  getSelectedAddressCoordinates: () => get().selectedAddressCoordinates,
  selectAddress: (addressId, selectedAddressCoordinates) =>
    set((state) => ({
      selectedAddressCoordinates,
      checkoutInformation: { ...state.checkoutInformation, addressId },
    })),
  saveCheckoutInformation: (information) =>
    set((state) => ({
      checkoutInformation: { ...state.checkoutInformation, ...information },
    })),
  clearCheckout: () =>
    set({
      prices: initialPrices,
      selectedAddressCoordinates: null,
      checkoutInformation: {},
    }),
}));
