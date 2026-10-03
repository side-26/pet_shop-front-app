import { date, mixed, number, object, string, type InferType } from 'yup';

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'cancelled'] as const;
export const PAYMENT_SORT_FIELDS = ['createdAt', 'updatedAt', 'amount', 'expiresAt'] as const;

const objectId = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();
const authority = string()
  .trim()
  .matches(/^[a-f\d]{64}$/i)
  .required();

export const paymentIdSchema = object({ id: objectId });
export const paymentAuthoritySchema = object({ authority });
export const createPaymentSchema = object({
  order: objectId,
  amount: number().min(0).required(),
  authority: string().trim().min(1).max(200).required(),
  expiresAt: date().required(),
});
/** The backend derives an immutable checkout snapshot from the authenticated user's cart. */
export const requestPaymentSchema = object({}).required();
export const getPaymentsSchema = object({
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).max(100).default(10).required(),
  sort: mixed<(typeof PAYMENT_SORT_FIELDS)[number]>()
    .oneOf(PAYMENT_SORT_FIELDS)
    .default('createdAt')
    .required(),
  status: mixed<(typeof PAYMENT_STATUSES)[number]>().oneOf(PAYMENT_STATUSES).optional(),
});
export const updatePaymentStatusSchema = object({
  id: objectId,
  status: mixed<(typeof PAYMENT_STATUSES)[number]>().oneOf(PAYMENT_STATUSES).required(),
  gatewayReferenceId: string().trim().min(1).max(200).optional(),
  paidAt: date().optional(),
});

export type PaymentIdInput = InferType<typeof paymentIdSchema>;
export type PaymentAuthorityInput = InferType<typeof paymentAuthoritySchema>;
export type CreatePaymentInput = InferType<typeof createPaymentSchema>;
export type RequestPaymentInput = InferType<typeof requestPaymentSchema>;
export type GetPaymentsInput = InferType<typeof getPaymentsSchema>;
export type UpdatePaymentStatusInput = InferType<typeof updatePaymentStatusSchema>;
