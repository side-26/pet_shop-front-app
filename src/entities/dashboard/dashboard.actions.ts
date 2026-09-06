'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import { dashboardMetricsQuerySchema } from './dashboard.schema';
import { getDashboardMetrics } from './dashboard.service';

function denied(): FetcherError {
  return {
    isSuccess: false,
    message: 'شما اجازه مشاهده آمار داشبورد را ندارید.',
    data: { messages: {}, details: {} },
  };
}

async function authorizeAdmin() {
  return (await getSession())?.role === USER_ROLES.ADMIN ? null : denied();
}

export async function getDashboardMetricsAction(input: unknown = {}) {
  const accessError = await authorizeAdmin();
  if (accessError) return accessError;

  try {
    const query = await dashboardMetricsQuerySchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return getDashboardMetrics(query);
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
