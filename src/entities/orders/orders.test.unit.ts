import { describe, expect, it } from 'vitest';

import { createOrderSchema, getOrdersSchema, updateOrderShippingInfoSchema } from './orders.schema';

describe('orders schemas', () => {
  it('validates checkout and applies list defaults', async () => {
    await expect(
      createOrderSchema.validate({ paymentTrackingId: '  payment-1  ' }),
    ).resolves.toEqual({ paymentTrackingId: 'payment-1' });
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
});
