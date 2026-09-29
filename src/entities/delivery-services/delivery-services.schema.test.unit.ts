import { describe, expect, it } from 'vitest';

import {
  availableDeliveryServicesQuerySchema,
  deliveryServiceIdSchema,
  deliveryServiceQuerySchema,
  deliveryServiceSchema,
} from './delivery-services.schema';

const schedule = {
  sunday: [{ startsAt: '08:00', endsAt: '12:00' }],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};

describe('delivery service schemas', () => {
  it('normalizes creation input and supplies the backend defaults', async () => {
    await expect(
      deliveryServiceSchema.validate({
        title: '  Courier  ',
        title_fa: '  پیک  ',
        logo: 'https://cdn.example.test/courier.webp',
        originCoordinates: [51.389, 35.689],
        availability: schedule,
        cityLeadDays: 0,
        outsideCityLeadDays: 1,
        pricePerKilometerInCity: 1000,
        pricePerKilometer: 2000,
      }),
    ).resolves.toMatchObject({
      title: 'Courier',
      title_fa: 'پیک',
      basePrice: 0,
      packingPrice: 0,
      isEnable: true,
    });
  });

  it('rejects invalid coordinates, incomplete schedules, prices, time ranges, and identifiers', async () => {
    await expect(
      deliveryServiceSchema.validate({
        title: 'Courier',
        title_fa: 'پیک',
        logo: 'not-a-url',
        originCoordinates: [181, 91],
        availability: { ...schedule, sunday: [{ startsAt: '12:00', endsAt: '08:00' }] },
        cityLeadDays: -1,
        outsideCityLeadDays: 1.5,
        pricePerKilometerInCity: 0,
        pricePerKilometer: 1.5,
      }),
    ).rejects.toBeDefined();
    await expect(deliveryServiceSchema.validate({ availability: schedule })).rejects.toBeDefined();
    await expect(deliveryServiceIdSchema.validate({ id: 'invalid' })).rejects.toBeDefined();
  });

  it('coerces request query values and applies the enabled-only default', async () => {
    await expect(deliveryServiceQuerySchema.validate({})).resolves.toEqual({
      includeDisabled: false,
    });
    await expect(deliveryServiceQuerySchema.validate({ includeDisabled: 'true' })).resolves.toEqual(
      {
        includeDisabled: true,
      },
    );
    await expect(
      availableDeliveryServicesQuerySchema.validate({ lat: '35.689', lng: '51.389' }),
    ).resolves.toEqual({
      lat: 35.689,
      lng: 51.389,
    });
  });
});
