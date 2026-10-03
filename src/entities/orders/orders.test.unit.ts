import { describe, expect, it } from 'vitest';

import {
  getOrdersSchema,
  prepareOrderSchema,
  updateOrderShippingInfoSchema,
} from './orders.schema';

describe('orders schemas', () => {
  it('validates checkout and applies list defaults', async () => {
    await expect(
      prepareOrderSchema.validate({
        addressId: '507f1f77bcf86cd799439011',
        deliveryServiceId: '507f1f77bcf86cd799439012',
        deliveryDateId: '03/10/2026',
        deliveryTimeSlotId: ' 03/10/2026-09:00-12:00 ',
      }),
    ).resolves.toEqual({
      addressId: '507f1f77bcf86cd799439011',
      deliveryServiceId: '507f1f77bcf86cd799439012',
      deliveryDateId: '03/10/2026',
      deliveryTimeSlotId: '03/10/2026-09:00-12:00',
    });
    await expect(getOrdersSchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
  });

  it('requires at least one mutable shipping-info field', async () => {
    await expect(
      updateOrderShippingInfoSchema.validate({ id: '507f1f77bcf86cd799439011' }),
    ).rejects.toThrow();
    await expect(
      updateOrderShippingInfoSchema.validate({
        id: '507f1f77bcf86cd799439011',
        trackingCode: ' 123 ',
      }),
    ).resolves.toMatchObject({ trackingCode: '123' });
  });

  it('validates the backend delivery-state query values', async () => {
    await expect(getOrdersSchema.validate({ deliveryState: 3 })).resolves.toMatchObject({
      deliveryState: 3,
    });
    await expect(getOrdersSchema.validate({ deliveryState: 4 })).rejects.toThrow();
  });
});
