'use client';

import { useMutation } from '@tanstack/react-query';

import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import { prepareServiceAction } from './orders.actions';
import type { PreparedOrderDTO, PrepareOrderDTO } from './orders.dto';

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
