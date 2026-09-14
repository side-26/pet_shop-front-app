import { boolean, mixed, number, object, ref, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';
import {
  MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  MAIN_IMAGE_UPLOAD_MIME_TYPES,
} from '@/configs/main-image-upload';
import { USER_ROLES } from '@/configs/user-role';
import { iranianPhoneNumberSchema } from '@/entities/auth/auth.schema';

export const USER_SORT_ORDERS = ['asc', 'dsc'] as const;
export const USER_ITEM_TYPES = ['product', 'pet'] as const;

export const userGetDetailByIdSchema = object({
  id: string()
    .trim()
    .required()
    .matches(/^[a-f\d]{24}$/i),
});

export type UserGetDetailByIdInput = InferType<typeof userGetDetailByIdSchema>;

export const deleteUserByIdSchema = userGetDetailByIdSchema;

export type DeleteUserByIdInput = InferType<typeof deleteUserByIdSchema>;

export const updateUserStatusByIdSchema = userGetDetailByIdSchema;

export type UpdateUserStatusByIdInput = InferType<typeof updateUserStatusByIdSchema>;

export const getAllPaginatedUsersSchema = object({
  fullName: string().trim().optional(),
  role: mixed<(typeof USER_ROLES)[keyof typeof USER_ROLES]>()
    .oneOf(Object.values(USER_ROLES))
    .optional(),
  phoneNumber: string().trim().optional(),
  nationalCode: string().trim().optional(),
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).default(20).required(),
  isEnable: boolean().nullable().optional(),
  sort: mixed<(typeof USER_SORT_ORDERS)[number]>().oneOf(USER_SORT_ORDERS).optional(),
});

export type GetAllPaginatedUsersInput = InferType<typeof getAllPaginatedUsersSchema>;

export const createUserSchema = object({
  phoneNumber: iranianPhoneNumberSchema,
  password: string().required().min(8),
  confirmPassword: string()
    .required()
    .min(8)
    .oneOf([ref('password')], yupMessage('userPasswordConfirmationMismatch')),
  role: mixed<(typeof USER_ROLES)[keyof typeof USER_ROLES]>()
    .oneOf(Object.values(USER_ROLES))
    .required(),
});

export type CreateUserInput = InferType<typeof createUserSchema>;

const optionalAvatarSchema = mixed<File>()
  .test(
    'type',
    yupMessage('imageType'),
    (value) =>
      !value ||
      MAIN_IMAGE_UPLOAD_MIME_TYPES.includes(
        value.type as (typeof MAIN_IMAGE_UPLOAD_MIME_TYPES)[number],
      ),
  )
  .test(
    'size',
    yupMessage('imageSize'),
    (value) => !value || value.size <= MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  )
  .nullable()
  .optional();

export const updateCurrentUserProfileSchema = object({
  firstName: string().trim().min(2).required(),
  lastName: string().trim().min(2).required(),
  avatar: optionalAvatarSchema,
});

export type UpdateCurrentUserProfileInput = InferType<typeof updateCurrentUserProfileSchema>;

export const changeCurrentUserPasswordSchema = object({
  oldPassword: string().required().min(8),
  password: string().required().min(8),
  repeatPassword: string()
    .required()
    .min(8)
    .oneOf([ref('password')], yupMessage('userPasswordConfirmationMismatch')),
});

export type ChangeCurrentUserPasswordInput = InferType<typeof changeCurrentUserPasswordSchema>;

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

export const createUserAddressSchema = object({
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
export type CreateUserAddressInput = InferType<typeof createUserAddressSchema>;

export const updateUserAddressSchema = createUserAddressSchema.partial().concat(
  object({
    receiverIsMe: boolean().optional(),
  }),
);
export type UpdateUserAddressInput = InferType<typeof updateUserAddressSchema>;
export const userAddressIdSchema = object({ addressId: objectIdSchema });
export type UserAddressIdInput = InferType<typeof userAddressIdSchema>;

export const addCartItemSchema = object({
  itemId: objectIdSchema,
  itemType: mixed<(typeof USER_ITEM_TYPES)[number]>().oneOf(USER_ITEM_TYPES).required(),
  quantity: number().integer().min(1).required(),
  weightId: objectIdSchema.optional(),
}).test(
  'product-weight',
  'وزن محصول الزامی است.',
  (value) => !value || (value.itemType === 'product' ? Boolean(value.weightId) : !value.weightId),
);
export type AddCartItemInput = InferType<typeof addCartItemSchema>;
export const cartEntryIdSchema = object({ id: objectIdSchema });
export type CartEntryIdInput = InferType<typeof cartEntryIdSchema>;
export const addWishlistItemSchema = object({
  itemId: objectIdSchema,
  itemType: mixed<(typeof USER_ITEM_TYPES)[number]>().oneOf(USER_ITEM_TYPES).required(),
});
export type AddWishlistItemInput = InferType<typeof addWishlistItemSchema>;
export const wishlistEntryIdSchema = cartEntryIdSchema;
export type WishlistEntryIdInput = InferType<typeof wishlistEntryIdSchema>;
