'use server';

import { ValidationError } from 'yup';

import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  createUserSchema,
  deleteUserByIdSchema,
  getAllPaginatedUsersSchema,
  userGetDetailByIdSchema,
} from './users.schema';
import {
  createUser,
  deleteUserById,
  getAllPaginatedUsers,
  userGetDetailById,
} from './users.service';

const ALLOWED_ADMIN_ROLES = new Set<UserRole>([USER_ROLES.ADMIN, USER_ROLES.SELLER]);

function accessError(message: string): FetcherError {
  return {
    isSuccess: false,
    message,
    data: { messages: {}, details: {} },
  };
}

export async function userGetDetailByIdAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای مشاهده کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه مشاهده این کاربر را ندارید.');
  }

  try {
    const { id } = await userGetDetailByIdSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return userGetDetailById(id);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function getAllPaginatedUsersAction(input: unknown = {}) {
  const session = await getSession();

  if (!session) {
    return accessError('برای مشاهده کاربران وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه مشاهده کاربران را ندارید.');
  }

  try {
    const validatedInput = await getAllPaginatedUsersSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return getAllPaginatedUsers(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function createUserAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای ایجاد کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه ایجاد کاربر را ندارید.');
  }

  try {
    const validatedInput = await createUserSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return createUser(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function deleteUserByIdAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای حذف کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه حذف این کاربر را ندارید.');
  }

  try {
    const { id } = await deleteUserByIdSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return deleteUserById(id);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}
