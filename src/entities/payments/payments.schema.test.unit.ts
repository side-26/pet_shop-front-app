import { describe, expect, it } from 'vitest';

import {
  getPaymentsSchema,
  paymentAuthoritySchema,
  requestPaymentSchema,
  updatePaymentStatusSchema,
} from './payments.schema';

describe('payment schemas', () => {
  it('normalizes authenticated list inputs and rejects unsupported filters', async () => {
    await expect(getPaymentsSchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
    await expect(getPaymentsSchema.validate({ page: 0 })).rejects.toThrow();
    await expect(getPaymentsSchema.validate({ status: 'processing' })).rejects.toThrow();
  });

  it('requires a prepared order for payment requests, gateway authorities, and status updates', async () => {
    const id = '507f1f77bcf86cd799439011';
    await expect(
      requestPaymentSchema.validate({ orderId: id }, { stripUnknown: true }),
    ).resolves.toEqual({ orderId: id });
    await expect(requestPaymentSchema.validate({})).rejects.toThrow();
    await expect(paymentAuthoritySchema.validate({ authority: 'a'.repeat(64) })).resolves.toEqual({
      authority: 'a'.repeat(64),
    });
    await expect(
      updatePaymentStatusSchema.validate({ id, status: 'paid', gatewayReferenceId: ' ref-1 ' }),
    ).resolves.toMatchObject({ gatewayReferenceId: 'ref-1' });
    await expect(
      paymentAuthoritySchema.validate({ authority: 'not-an-authority' }),
    ).rejects.toThrow();
  });
});
