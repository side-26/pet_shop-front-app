'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  availableDeliveryServicesQuerySchema,
  deliveryServiceIdSchema,
  deliveryServiceQuerySchema,
  deliveryServiceSchema,
  updateDeliveryServiceSchema,
} from './delivery-services.schema';
import * as service from './delivery-services.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

async function authorizeManagement() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? null
    : accessError('شما اجازه مشاهده یا مدیریت سرویس‌های ارسال را ندارید.');
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

export async function getAvailableDeliveryServicesAction(input: unknown) {
  const query = await validate(availableDeliveryServicesQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAvailableDeliveryServices(query);
}

export async function getAllDeliveryServicesAction(input: unknown = {}) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const query = await validate(deliveryServiceQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAllDeliveryServices(query);
}

export async function getDeliveryServiceByIdAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(deliveryServiceIdSchema, input);
  return 'isSuccess' in value ? value : service.getDeliveryServiceById(value.id);
}

export async function createDeliveryServiceAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(deliveryServiceSchema, input);
  return 'isSuccess' in value ? value : service.createDeliveryService(value);
}

export async function updateDeliveryServiceAction(input: unknown) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const id = await validate(deliveryServiceIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updateDeliveryServiceSchema, input);
  return 'isSuccess' in value ? value : service.updateDeliveryService(id.id, value);
}

async function runById<T>(input: unknown, action: (id: string) => Promise<T>) {
  const denied = await authorizeManagement();
  if (denied) return denied;
  const value = await validate(deliveryServiceIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}

export async function enableDeliveryServiceAction(input: unknown) {
  return runById(input, service.enableDeliveryService);
}

export async function disableDeliveryServiceAction(input: unknown) {
  return runById(input, service.disableDeliveryService);
}

export async function deleteDeliveryServiceAction(input: unknown) {
  return runById(input, service.deleteDeliveryService);
}
