'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import { brandIdSchema, brandQuerySchema, brandSchema, updateBrandSchema } from './brands.schema';
import * as service from './brands.service';

const accessError = (message: string): FetcherError => ({
  isSuccess: false,
  message,
  data: { messages: {}, details: {} },
});

async function authorizeManagement() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? null
    : accessError('شما اجازه مشاهده یا مدیریت برندها را ندارید.');
}

async function validate<T>(
  schema: { validate(input: unknown, options: object): Promise<T> },
  input: unknown,
) {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function getAllBrandsAction(input: unknown = {}) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const query = await validate(brandQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAllBrands(query);
}

export async function getBrandByIdAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(brandIdSchema, input);
  return 'isSuccess' in value ? value : service.getBrandById(value.id);
}

export async function createBrandAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(brandSchema, input);
  return 'isSuccess' in value ? value : service.createBrand(value);
}

export async function updateBrandAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const id = await validate(brandIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updateBrandSchema, input);
  return 'isSuccess' in value ? value : service.updateBrand(id.id, value);
}

async function runById<T>(input: unknown, action: (id: string) => Promise<T>) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(brandIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}

export async function enableBrandAction(input: unknown) {
  return runById(input, service.enableBrand);
}

export async function disableBrandAction(input: unknown) {
  return runById(input, service.disableBrand);
}

export async function deleteBrandAction(input: unknown) {
  return runById(input, service.deleteBrand);
}
