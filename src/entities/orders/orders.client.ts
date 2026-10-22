'use client';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { internalFetcher } from '@/lib/api/internalFetcher';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import { prepareServiceAction } from './orders.actions';
import type { OrderDTO, PreparedOrderDTO, PrepareOrderDTO } from './orders.dto';

export const ordersQueryKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...ordersQueryKeys.all, 'detail', id] as const,
};

async function fetchOrderDetail(id: string, signal?: AbortSignal): Promise<OrderDTO> {
  return internalFetcher<OrderDTO>({ url: `/api/orders/${encodeURIComponent(id)}`, signal });
}

export function useOrderDetailQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ordersQueryKeys.detail(id),
    queryFn: ({ signal }) => fetchOrderDetail(id, signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function usePrepareOrderMutation() {
  return useMutation<PreparedOrderDTO, FetcherError, PrepareOrderDTO>({
    mutationFn: async (input) => {
      const result = (await prepareServiceAction(input)) as
        FetcherResult<PreparedOrderDTO> | undefined;
      if (!result?.isSuccess) {
        throw (
          result ?? {
            isSuccess: false,
            message: 'پاسخ آماده‌سازی سفارش نامعتبر است.',
            data: { messages: {}, details: {} },
          }
        );
      }
      return result.data;
    },
    retry: 0,
    onError: (error) => globalErrorHandler(error),
  });
}
