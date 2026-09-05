'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import { deleteImageSchema } from './images.schema';
import { deleteImage } from './images.service';

function denied(): FetcherError {
  return {
    isSuccess: false,
    message: 'شما اجازه مدیریت تصاویر را ندارید.',
    data: { messages: {}, details: {} },
  };
}

async function authorizeManagement() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER ? null : denied();
}

export async function deleteImageAction(input: unknown) {
  const accessError = await authorizeManagement();
  if (accessError) return accessError;

  try {
    const value = await deleteImageSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return deleteImage(value);
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
