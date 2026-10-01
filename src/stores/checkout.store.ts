'use client';

import { create } from 'zustand';

import type { DeliveryAvailabilityDayDTO } from '@/entities/delivery-services/delivery-services.dto';

export type CheckoutPriceLine = Readonly<{
  price: number;
  discountPercentage: number;
  quantity: number;
}>;

export type CheckoutPrices = Readonly<{
  productPrice: number;
  discountPrice: number;
  shippingPrice: number;
  packingPrice: number;
  payablePrice: number;
}>;

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

const initialPrices: CheckoutPrices = {
  productPrice: 0,
  discountPrice: 0,
  shippingPrice: 0,
  packingPrice: 0,
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
  packingPrice = 0,
): CheckoutPrices {
  if (!isNonNegativeFiniteNumber(shippingPrice)) {
    throw new Error('Shipping price must be a non-negative finite number.');
  }
  if (!isNonNegativeFiniteNumber(packingPrice)) {
    throw new Error('Packing price must be a non-negative finite number.');
  }

  const { productPrice, discountPrice } = lines.reduce(
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
        productPrice: totals.productPrice + linePrice,
        discountPrice: totals.discountPrice + linePrice * (line.discountPercentage / 100),
      };
    },
    { productPrice: 0, discountPrice: 0 },
  );

  return {
    productPrice,
    discountPrice,
    shippingPrice,
    packingPrice,
    payablePrice: productPrice - discountPrice + shippingPrice + packingPrice,
  };
}

type CheckoutStore = {
  prices: CheckoutPrices;
  selectedAddressCoordinates: CheckoutAddressCoordinates | null;
  selectedAddress: CheckoutSelectedAddress | null;
  checkoutInformation: CheckoutInformation;

  calculatePrices: (
    lines: readonly CheckoutPriceLine[],
    shippingPrice?: number,
    packingPrice?: number,
  ) => CheckoutPrices;
  setCartPrices: (prices: Pick<CheckoutPrices, 'productPrice' | 'discountPrice'>) => CheckoutPrices;
  setDeliveryPrices: (shippingPrice: number, packingPrice: number) => CheckoutPrices;
  setSelectedAddressCoordinates: (coordinates: CheckoutAddressCoordinates | null) => void;
  getSelectedAddressCoordinates: () => CheckoutAddressCoordinates | null;
  selectAddress: (address: CheckoutSelectedAddress) => void;
  saveCheckoutInformation: (information: Partial<CheckoutInformation>) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  prices: initialPrices,
  selectedAddressCoordinates: null,
  selectedAddress: null,
  checkoutInformation: {},

  calculatePrices: (lines, shippingPrice = 0, packingPrice = 0) => {
    const prices = calculateCheckoutPrices(lines, shippingPrice, packingPrice);
    set({ prices });
    return prices;
  },
  setCartPrices: ({ productPrice, discountPrice }) => {
    if (!isNonNegativeFiniteNumber(productPrice) || !isNonNegativeFiniteNumber(discountPrice)) {
      throw new Error('Product prices must be non-negative finite numbers.');
    }

    const { shippingPrice, packingPrice } = get().prices;
    const prices: CheckoutPrices = {
      productPrice,
      discountPrice,
      shippingPrice,
      packingPrice,
      payablePrice: productPrice - discountPrice + shippingPrice + packingPrice,
    };
    set({ prices });
    return prices;
  },
  setDeliveryPrices: (shippingPrice, packingPrice) => {
    if (!isNonNegativeFiniteNumber(shippingPrice) || !isNonNegativeFiniteNumber(packingPrice)) {
      throw new Error('Delivery prices must be non-negative finite numbers.');
    }

    const { productPrice, discountPrice } = get().prices;
    const prices: CheckoutPrices = {
      productPrice,
      discountPrice,
      shippingPrice,
      packingPrice,
      payablePrice: productPrice - discountPrice + shippingPrice + packingPrice,
    };
    set({ prices });
    return prices;
  },
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
      prices: initialPrices,
      selectedAddressCoordinates: null,
      selectedAddress: null,
      checkoutInformation: {},
    }),
}));
