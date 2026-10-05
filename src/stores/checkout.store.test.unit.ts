import { afterEach, describe, expect, it } from 'vitest';

import { useCheckoutStore } from './checkout.store';

function resetCheckoutStore() {
  useCheckoutStore.getState().clearCheckout();
}

afterEach(resetCheckoutStore);

describe('useCheckoutStore', () => {
  it('stores selected address coordinates and order-ready checkout information', () => {
    useCheckoutStore.getState().selectAddress({
      id: 'address-1',
      title: 'تهران',
      address: 'تهران، خیابان علامه',
      recipient: 'نیلوفر احمدی',
      phone: '09121234567',
      postalCode: '1998712345',
      latLng: [35.72, 51.33],
    });
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
    useCheckoutStore.getState().setSelectedAddressCoordinates([35.72, 51.33]);
    useCheckoutStore.getState().saveCheckoutInformation({ addressId: 'address-1' });

    useCheckoutStore.getState().clearCheckout();

    expect(useCheckoutStore.getState()).toMatchObject({
      selectedAddressCoordinates: null,
      checkoutInformation: {},
    });
  });
});
