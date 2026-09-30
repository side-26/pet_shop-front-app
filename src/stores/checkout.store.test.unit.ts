import { afterEach, describe, expect, it } from 'vitest';

import { calculateCheckoutPrices, useCheckoutStore } from './checkout.store';

function resetCheckoutStore() {
  useCheckoutStore.getState().clearCheckout();
}

afterEach(resetCheckoutStore);

describe('calculateCheckoutPrices', () => {
  it('calculates gross price, discounts, shipping, and the payable total', () => {
    expect(
      calculateCheckoutPrices(
        [
          { price: 100_000, discountPercentage: 10, quantity: 2 },
          { price: 80_000, discountPercentage: 25, quantity: 1 },
        ],
        30_000,
        10_000,
      ),
    ).toEqual({
      productPrice: 280_000,
      discountPrice: 40_000,
      shippingPrice: 30_000,
      packingPrice: 10_000,
      payablePrice: 280_000,
    });
  });

  it('rejects invalid price inputs before they can corrupt checkout totals', () => {
    expect(() =>
      calculateCheckoutPrices([{ price: -1, discountPercentage: 0, quantity: 1 }]),
    ).toThrow('Checkout line price');
    expect(() =>
      calculateCheckoutPrices([{ price: 1, discountPercentage: 101, quantity: 1 }]),
    ).toThrow('discount percentage');
    expect(() =>
      calculateCheckoutPrices([{ price: 1, discountPercentage: 0, quantity: 0 }]),
    ).toThrow('quantity');
  });
});

describe('useCheckoutStore', () => {
  it('keeps product, discount, shipping, and packing prices in one payable total', () => {
    useCheckoutStore.getState().setCartPrices({ productPrice: 300_000, discountPrice: 45_000 });
    const prices = useCheckoutStore.getState().setDeliveryPrices(25_000, 10_000);

    expect(prices).toEqual({
      productPrice: 300_000,
      discountPrice: 45_000,
      shippingPrice: 25_000,
      packingPrice: 10_000,
      payablePrice: 290_000,
    });
  });

  it('stores calculated prices, selected address coordinates, and order-ready checkout information', () => {
    const prices = useCheckoutStore
      .getState()
      .calculatePrices([{ price: 50_000, discountPercentage: 20, quantity: 2 }], 15_000, 5_000);
    useCheckoutStore.getState().selectAddress('address-1', [35.72, 51.33]);
    useCheckoutStore.getState().saveCheckoutInformation({
      deliveryServiceId: 'delivery-service-1',
      deliveryServiceAvailability: [
        {
          weekday: 'sunday',
          weekday_fa: 'یکشنبه',
          date: '01/10/2026',
          month_ja: 7,
          day_ja: 9,
          availableTimes: [{ start: 9, end: 11 }],
        },
      ],
      deliveryDate: {
        id: 'thu-6-shahrivar',
        weekday: 'پنجشنبه',
      },
      deliveryTimeSlot: {
        id: 'morning',
        label: '۹ تا ۱۲',
        description: 'صبح',
        weekday: 'thursday',
        startsAt: '09:00',
        endsAt: '12:00',
      },
      deliveryQuoteId: 'quote-1',
      deliveryWindowId: 'window-1',
      paymentTrackingId: 'payment-1',
    });

    expect(prices).toEqual({
      productPrice: 100_000,
      discountPrice: 20_000,
      shippingPrice: 15_000,
      packingPrice: 5_000,
      payablePrice: 100_000,
    });
    expect(useCheckoutStore.getState().getSelectedAddressCoordinates()).toEqual([35.72, 51.33]);
    expect(useCheckoutStore.getState().checkoutInformation).toEqual({
      addressId: 'address-1',
      deliveryServiceId: 'delivery-service-1',
      deliveryServiceAvailability: [
        {
          weekday: 'sunday',
          weekday_fa: 'یکشنبه',
          date: '01/10/2026',
          month_ja: 7,
          day_ja: 9,
          availableTimes: [{ start: 9, end: 11 }],
        },
      ],
      deliveryDate: {
        id: 'thu-6-shahrivar',
        weekday: 'پنجشنبه',
      },
      deliveryTimeSlot: {
        id: 'morning',
        label: '۹ تا ۱۲',
        description: 'صبح',
        weekday: 'thursday',
        startsAt: '09:00',
        endsAt: '12:00',
      },
      deliveryQuoteId: 'quote-1',
      deliveryWindowId: 'window-1',
      paymentTrackingId: 'payment-1',
    });
  });

  it('clears every checkout value after an order is complete or abandoned', () => {
    useCheckoutStore
      .getState()
      .calculatePrices([{ price: 10, discountPercentage: 0, quantity: 1 }]);
    useCheckoutStore.getState().setSelectedAddressCoordinates([35.72, 51.33]);
    useCheckoutStore.getState().saveCheckoutInformation({ addressId: 'address-1' });

    useCheckoutStore.getState().clearCheckout();

    expect(useCheckoutStore.getState()).toMatchObject({
      prices: {
        productPrice: 0,
        discountPrice: 0,
        shippingPrice: 0,
        packingPrice: 0,
        payablePrice: 0,
      },
      selectedAddressCoordinates: null,
      checkoutInformation: {},
    });
  });
});
