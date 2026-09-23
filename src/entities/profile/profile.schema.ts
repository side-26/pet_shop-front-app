import { boolean, mixed, number, object, ref, string, type InferType } from 'yup';

import '@/configs/yup.config';
import { yupMessage } from '@/configs/yup.config';
import { iranianPhoneNumberSchema } from '@/entities/auth/auth.schema';
import { ORDER_DELIVERY_STATES, ORDER_SORT_FIELDS } from '@/entities/orders/orders.schema';

const objectIdSchema = string()
  .trim()
  .required()
  .matches(/^[a-f\d]{24}$/i);

const addressReceiverSchema = object({
  firstName: string()
    .trim()
    .min(2)
    .when('receiverIsMe', { is: false, then: (schema) => schema.required() }),
  lastName: string()
    .trim()
    .min(2)
    .when('receiverIsMe', { is: false, then: (schema) => schema.required() }),
  nationalCode: string()
    .matches(/^\d{10}$/)
    .when('receiverIsMe', { is: false, then: (schema) => schema.required() }),
  phoneNumber: iranianPhoneNumberSchema.when('receiverIsMe', {
    is: false,
    then: (schema) => schema.required(),
  }),
});

export const resetProfilePasswordSchema = object({
  oldPassword: string().required().min(8),
  password: string().required().min(8),
  repeatPassword: string()
    .required()
    .min(8)
    .oneOf([ref('password')], yupMessage('userPasswordConfirmationMismatch')),
});

export const createProfileAddressSchema = object({
  province: string().trim().min(2).required(),
  city: string().trim().min(2).required(),
  detailAddress: string().trim().min(5).required(),
  plate: string().trim().min(1).required(),
  unit: string().trim().nullable().optional(),
  postalCode: string()
    .matches(/^\d{10}$/)
    .required(),
  receiverIsMe: boolean().default(false).required(),
}).concat(addressReceiverSchema);

export const updateProfileAddressSchema = createProfileAddressSchema
  .partial()
  .concat(object({ receiverIsMe: boolean().optional() }));

export const profileAddressIdSchema = object({ addressId: objectIdSchema });
export const profileOrderIdSchema = object({ id: objectIdSchema });
export const getProfileOrdersSchema = object({
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).max(100).default(10).required(),
  sort: mixed<(typeof ORDER_SORT_FIELDS)[number]>()
    .oneOf(ORDER_SORT_FIELDS)
    .default('createdAt')
    .required(),
  deliveryState: mixed<(typeof ORDER_DELIVERY_STATES)[number]>()
    .oneOf(ORDER_DELIVERY_STATES)
    .optional(),
});

export type ResetProfilePasswordInput = InferType<typeof resetProfilePasswordSchema>;
export type CreateProfileAddressInput = InferType<typeof createProfileAddressSchema>;
export type UpdateProfileAddressInput = InferType<typeof updateProfileAddressSchema>;
export type ProfileAddressIdInput = InferType<typeof profileAddressIdSchema>;
export type ProfileOrderIdInput = InferType<typeof profileOrderIdSchema>;
export type GetProfileOrdersInput = InferType<typeof getProfileOrdersSchema>;
