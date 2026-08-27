import * as yup from 'yup';

import { USER_ROLES } from '@/configs/user-role';

export const USER_SORT_ORDERS = ['asc', 'dsc'] as const;

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
