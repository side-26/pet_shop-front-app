'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { deleteSessionCookie, getSession } from '@/utils/session';

import {
  createProfileAddressSchema,
  getProfileOrdersSchema,
  profileAddressIdSchema,
  profileOrderIdSchema,
  resetProfilePasswordSchema,
  updateProfileAddressSchema,
} from './profile.schema';
import * as service from './profile.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

async function authorizeCustomer() {
  const session = await getSession();
  if (!session)
    return { error: accessError('برای مشاهده پروفایل وارد حساب کاربری شوید.') } as const;
  if (session.role !== USER_ROLES.CUSTOMER) {
    return { error: accessError('این بخش فقط برای حساب مشتری در دسترس است.') } as const;
  }
  return { session } as const;
}

async function validate<T>(
  schema: { validate(value: unknown, options: object): Promise<T> },
  input: unknown,
) {
  try {
    return {
      value: await schema.validate(input, { abortEarly: false, stripUnknown: true }),
    } as const;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: validationErrorToFetcherError(error) } as const;
    }
    throw error;
  }
}

export async function getProfileAccountAction() {
  const auth = await authorizeCustomer();
  return 'error' in auth ? auth.error : service.getProfileAccount(auth.session.userId);
}

export async function resetProfilePasswordAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(resetProfilePasswordSchema, input);
  if ('error' in parsed) return parsed.error;

  const result = await service.resetProfilePassword(parsed.value);
  if (result.isSuccess) await deleteSessionCookie();
  return result;
}

export async function getProfileAddressesAction() {
  const auth = await authorizeCustomer();
  return 'error' in auth ? auth.error : service.getProfileAddresses(auth.session.userId);
}

export async function getProfileAddressAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(profileAddressIdSchema, input);
  return 'error' in parsed
    ? parsed.error
    : service.getProfileAddress(auth.session.userId, parsed.value.addressId);
}

export async function createProfileAddressAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(createProfileAddressSchema, input);
  return 'error' in parsed ? parsed.error : service.createProfileAddress(parsed.value);
}

export async function updateProfileAddressAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const id = await validate(profileAddressIdSchema, input);
  if ('error' in id) return id.error;
  const parsed = await validate(updateProfileAddressSchema, input);
  return 'error' in parsed
    ? parsed.error
    : service.updateProfileAddress(auth.session.userId, id.value.addressId, parsed.value);
}

export async function deleteProfileAddressAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(profileAddressIdSchema, input);
  return 'error' in parsed
    ? parsed.error
    : service.deleteProfileAddress(auth.session.userId, parsed.value.addressId);
}

export async function getProfileOrdersAction(input: unknown = {}) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(getProfileOrdersSchema, input);
  return 'error' in parsed
    ? parsed.error
    : service.getProfileOrders(auth.session.userId, parsed.value);
}

export async function getProfileOrderAction(input: unknown) {
  const auth = await authorizeCustomer();
  if ('error' in auth) return auth.error;
  const parsed = await validate(profileOrderIdSchema, input);
  return 'error' in parsed
    ? parsed.error
    : service.getProfileOrder(auth.session.userId, parsed.value.id);
}
