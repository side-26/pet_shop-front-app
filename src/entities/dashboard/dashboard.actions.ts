'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { unwrapResult, unwrapValidate } from '@/lib/utils';
import { getSession } from '@/utils/session';

import { dashboardMetricsQuerySchema } from './dashboard.schema';
import { getDashboardMetrics } from './dashboard.service';

async function requireAdmin(): Promise<void> {
  if ((await getSession())?.role !== USER_ROLES.ADMIN) {
    throw new Error('شما اجازه مشاهده آمار داشبورد را ندارید.');
  }
}

async function validate<T>(
  schema: { validate(input: unknown, options: object): Promise<T> },
  input: unknown,
): Promise<T | FetcherError> {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function getDashboardMetricsAction(input: unknown = {}) {
  await requireAdmin();

  const query = await unwrapValidate(validate(dashboardMetricsQuerySchema, input));
  return unwrapResult(getDashboardMetrics(query));
}
