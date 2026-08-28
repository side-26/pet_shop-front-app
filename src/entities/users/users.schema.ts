import * as yup from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { iranianPhoneNumberSchema } from '@/entities/auth/auth.schema';

export const USER_SORT_ORDERS = ['asc', 'dsc'] as const;

export const userGetDetailByIdSchema = yup.object({
  id: yup
    .string()
    .trim()
    .required('شناسه کاربر الزامی است.')
    .matches(/^[a-f\d]{24}$/i, 'شناسه کاربر معتبر نیست.'),
});

export type UserGetDetailByIdInput = yup.InferType<typeof userGetDetailByIdSchema>;

export const getAllPaginatedUsersSchema = yup.object({
  fullName: yup.string().trim().optional(),
  role: yup
    .mixed<(typeof USER_ROLES)[keyof typeof USER_ROLES]>()
    .oneOf(Object.values(USER_ROLES))
    .optional(),
  phoneNumber: yup.string().trim().optional(),
  nationalCode: yup.string().trim().optional(),
  page: yup.number().integer().min(1).default(1).required(),
  limit: yup.number().integer().min(1).default(20).required(),
  isEnable: yup.boolean().default(true).required(),
  sort: yup.mixed<(typeof USER_SORT_ORDERS)[number]>().oneOf(USER_SORT_ORDERS).optional(),
});

export type GetAllPaginatedUsersInput = yup.InferType<typeof getAllPaginatedUsersSchema>;

export const createUserSchema = yup.object({
  phoneNumber: iranianPhoneNumberSchema,
  password: yup
    .string()
    .required('کلمه عبور الزامی است.')
    .min(8, 'کلمه عبور باید حداقل ۸ نویسه باشد.'),
  confirmPassword: yup
    .string()
    .required('تکرار کلمه عبور الزامی است.')
    .min(8, 'تکرار کلمه عبور باید حداقل ۸ نویسه باشد.')
    .oneOf([yup.ref('password')], 'تکرار کلمه عبور با کلمه عبور یکسان نیست.'),
  role: yup
    .mixed<(typeof USER_ROLES)[keyof typeof USER_ROLES]>()
    .oneOf(Object.values(USER_ROLES), 'نقش کاربر معتبر نیست.')
    .required('نقش کاربر الزامی است.'),
});

export type CreateUserInput = yup.InferType<typeof createUserSchema>;
