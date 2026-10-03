import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CreatePaymentDTO,
  GatewayPaymentDTO,
  GatewayPaymentResultDTO,
  GetPaymentsParams,
  GetPaymentsQueryDTO,
  PaymentDTO,
  PaymentRequestDTO,
  PaymentsPageDTO,
  RequestPaymentDTO,
  UpdatePaymentStatusDTO,
} from './payments.dto';
import { createPaymentsListCacheKey } from './payments.helpers';
import { getPaymentsSchema } from './payments.schema';

const paymentsCache = new EntityTag('payments');

async function fetchPayments(url: '/payments' | '/payments/all', query: GetPaymentsQueryDTO) {
  'use cache: private';

  paymentsCache.cacheLife({ stale: 120 });
  paymentsCache.registerList(`${url}:${createPaymentsListCacheKey(query)}`);
  return customFetcher<PaymentsPageDTO>({
    url,
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getUserPayments(params: GetPaymentsParams = {}) {
  return fetchPayments(
    '/payments',
    await getPaymentsSchema.validate(params, { stripUnknown: true }),
  );
}

export async function getAllPayments(params: GetPaymentsParams = {}) {
  return fetchPayments(
    '/payments/all',
    await getPaymentsSchema.validate(params, { stripUnknown: true }),
  );
}

export async function getUserPayment(id: string) {
  'use cache: private';

  paymentsCache.cacheLife({ stale: 120 });
  paymentsCache.registerDetail(id);
  return customFetcher<PaymentDTO>({
    url: `/payments/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export function getGatewayPayment(authority: string) {
  return customFetcher<GatewayPaymentDTO>({
    url: `/gateway/payments/${authority}`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export async function createPayment(input: CreatePaymentDTO) {
  const result = await customFetcher<PaymentDTO, unknown, CreatePaymentDTO>({
    url: '/payments',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) paymentsCache.invalidateList();
  return result;
}

export async function requestPayment(input: RequestPaymentDTO) {
  const result = await customFetcher<PaymentRequestDTO, unknown, RequestPaymentDTO>({
    url: '/payments/request',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) paymentsCache.invalidateList();
  return result;
}

export async function updatePaymentStatus(input: UpdatePaymentStatusDTO) {
  const { id, ...body } = input;
  const result = await customFetcher<PaymentDTO, unknown, typeof body>({
    url: `/payments/${id}/status`,
    method: 'PATCH',
    body,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) {
    paymentsCache.invalidateDetail(id);
    paymentsCache.invalidateList();
  }
  return result;
}

export async function payGatewayPayment(authority: string) {
  const result = await customFetcher<GatewayPaymentResultDTO, unknown, undefined>({
    url: `/gateway/payments/${authority}/pay`,
    method: 'POST',
    body: undefined,
    auth: false,
    cache: 'no-store',
  });
  if (result.isSuccess) paymentsCache.invalidateAll();
  return result;
}

export function cancelGatewayPayment(authority: string) {
  return customFetcher<void, unknown, undefined>({
    url: `/gateway/payments/${authority}/cancel`,
    method: 'POST',
    body: undefined,
    auth: false,
    cache: 'no-store',
  });
}
