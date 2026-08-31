import { boolean, mixed, number, object, ref, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';
import { USER_ROLES } from '@/configs/user-role';
import { iranianPhoneNumberSchema } from '@/entities/auth/auth.schema';

export const USER_SORT_ORDERS = ['asc', 'dsc'] as const;

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
