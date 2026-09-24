'use server';

import { ValidationError } from 'yup';

import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import { provinceIdSchema, reverseGeocodeSchema } from './locations.schema';
import { getCitiesByProvinceId, getProvinces, reverseGeocode } from './locations.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

export async function getProvincesAction() {
  return getProvinces();
}

export async function getCitiesByProvinceIdAction(input: unknown) {
  try {
    const value = await provinceIdSchema.validate(input, { abortEarly: false, stripUnknown: true });
    return getCitiesByProvinceId(value);
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function reverseGeocodeAction(input: unknown) {
  if (!(await getSession())) return accessError('برای دریافت نشانی وارد حساب کاربری شوید.');

  try {
    const value = await reverseGeocodeSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return reverseGeocode(value);
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
