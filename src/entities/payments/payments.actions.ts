'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  createPaymentSchema,
  getPaymentsSchema,
  paymentAuthoritySchema,
  paymentIdSchema,
  requestPaymentSchema,
  updatePaymentStatusSchema,
} from './payments.schema';
import * as service from './payments.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
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
    if (error instanceof ValidationError)
      return { error: validationErrorToFetcherError(error) } as const;
    throw error;
  }
}

async function authorizeUser() {
  const session = await getSession();
  return session
    ? { session }
    : { error: accessError('برای مدیریت پرداخت‌ها وارد حساب کاربری شوید.') };
}

async function authorizeManagement() {
  const session = await getSession();
  if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.SELLER))
    return { error: accessError('شما اجازه مدیریت پرداخت‌ها را ندارید.') } as const;
  return { session } as const;
}

export async function getUserPaymentsAction(input: unknown = {}) {
  const auth = await authorizeUser();
  if ('error' in auth) return auth.error;
  const parsed = await validate(getPaymentsSchema, input);
  return 'error' in parsed ? parsed.error : service.getUserPayments(parsed.value);
}

export async function getUserPaymentAction(input: unknown) {
  const auth = await authorizeUser();
  if ('error' in auth) return auth.error;
  const parsed = await validate(paymentIdSchema, input);
  return 'error' in parsed ? parsed.error : service.getUserPayment(parsed.value.id);
}

export async function createPaymentAction(input: unknown) {
  const auth = await authorizeUser();
  if ('error' in auth) return auth.error;
  const parsed = await validate(createPaymentSchema, input);
  return 'error' in parsed ? parsed.error : service.createPayment(parsed.value);
}

export async function requestPaymentAction(input: unknown) {
  const auth = await authorizeUser();
  if ('error' in auth) return auth.error;
  const parsed = await validate(requestPaymentSchema, input);
  return 'error' in parsed ? parsed.error : service.requestPayment(parsed.value);
}

export async function getAllPaymentsAction(input: unknown = {}) {
  const auth = await authorizeManagement();
  if ('error' in auth) return auth.error;
  const parsed = await validate(getPaymentsSchema, input);
  return 'error' in parsed ? parsed.error : service.getAllPayments(parsed.value);
}

export async function updatePaymentStatusAction(input: unknown) {
  const auth = await authorizeManagement();
  if ('error' in auth) return auth.error;
  const parsed = await validate(updatePaymentStatusSchema, input);
  return 'error' in parsed ? parsed.error : service.updatePaymentStatus(parsed.value);
}

export async function getGatewayPaymentAction(input: unknown) {
  const parsed = await validate(paymentAuthoritySchema, input);
  return 'error' in parsed ? parsed.error : service.getGatewayPayment(parsed.value.authority);
}

export async function payGatewayPaymentAction(input: unknown) {
  const parsed = await validate(paymentAuthoritySchema, input);
  return 'error' in parsed ? parsed.error : service.payGatewayPayment(parsed.value.authority);
}

export async function cancelGatewayPaymentAction(input: unknown) {
  const parsed = await validate(paymentAuthoritySchema, input);
  return 'error' in parsed ? parsed.error : service.cancelGatewayPayment(parsed.value.authority);
}
