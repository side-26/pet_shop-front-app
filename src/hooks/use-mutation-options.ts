'use client';

import type { UseMutationOptions } from '@tanstack/react-query';

import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

export type ActionMutation<TVariables> = (variables: TVariables) => Promise<FetcherResult<unknown>>;

export type ActionMutationOptions<TVariables> = Omit<
  UseMutationOptions<FetcherResult<unknown>, FetcherError, TVariables>,
  'mutationFn'
>;

/** Builds the shared action-result mutation contract while allowing entity-specific options. */
export function useMutationOptions<TVariables>(
  action: ActionMutation<TVariables>,
  { retry = false, onError, onSuccess, ...options }: ActionMutationOptions<TVariables> = {},
): UseMutationOptions<FetcherResult<unknown>, FetcherError, TVariables> {
  return {
    ...options,
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry,
    onError: (error, variables, context, mutationContext) => {
      if (onError) return onError(error, variables, context, mutationContext);
      return globalErrorHandler(error);
    },
    onSuccess: (result, variables, context, mutationContext) => {
      toast.add({ type: 'success', title: result.message });
      return onSuccess?.(result, variables, context, mutationContext);
    },
  };
}
