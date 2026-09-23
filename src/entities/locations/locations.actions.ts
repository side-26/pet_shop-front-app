'use server';

import { ValidationError } from 'yup';

import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';

import { provinceIdSchema } from './locations.schema';
import { getCitiesByProvinceId, getProvinces } from './locations.service';

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
