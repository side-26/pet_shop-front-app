'use client';

import { useMutation } from '@tanstack/react-query';

import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  cancelGatewayPaymentAction,
  createPaymentAction,
  payGatewayPaymentAction,
  requestPaymentAction,
  updatePaymentStatusAction,
} from './payments.actions';
import type { CreatePaymentDTO, RequestPaymentDTO, UpdatePaymentStatusDTO } from './payments.dto';
import type { PaymentAuthorityInput } from './payments.schema';

const PAYMENT_MUTATION_RETRY_COUNT = 2;
const invalidActionResult: FetcherError = {
  isSuccess: false,
  message: 'پاسخ عملیات پرداخت نامعتبر است.',
  data: { messages: {}, details: {} },
};

function usePaymentMutation<TData, TVariables>(
  action: (variables: TVariables) => Promise<FetcherResult<TData> | undefined>,
) {
  return useMutation<TData, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result?.isSuccess) throw result ?? invalidActionResult;
      return result.data;
    },
    retry: PAYMENT_MUTATION_RETRY_COUNT,
    retryDelay: 0,
    onError: (error) => globalErrorHandler(error),
  });
}

export function useCreatePaymentMutation() {
  return usePaymentMutation((input: CreatePaymentDTO) => createPaymentAction(input));
}

export function useRequestPaymentMutation() {
  return usePaymentMutation((input: RequestPaymentDTO) => requestPaymentAction(input));
}

export function useUpdatePaymentStatusMutation() {
  return usePaymentMutation((input: UpdatePaymentStatusDTO) => updatePaymentStatusAction(input));
}

export function usePayGatewayPaymentMutation() {
  return usePaymentMutation((input: PaymentAuthorityInput) => payGatewayPaymentAction(input));
}

export function useCancelGatewayPaymentMutation() {
  return usePaymentMutation((input: PaymentAuthorityInput) => cancelGatewayPaymentAction(input));
}
