'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createBrandAction,
  deleteBrandAction,
  disableBrandAction,
  enableBrandAction,
  updateBrandAction,
} from './brands.actions';
import type { BrandInput, UpdateBrandInput } from './brands.schema';

type BrandMutationAction<TVariables> = (input: TVariables) => Promise<FetcherResult<unknown>>;
type BrandMutationOptions = {
  onError?: (error: FetcherError) => void;
};

/** Brand reads are Server Component data; EntityTag invalidation refreshes them. */
function useBrandMutation<TVariables>(
  action: BrandMutationAction<TVariables>,
  { onError = globalErrorHandler }: BrandMutationOptions = {},
) {
  return useMutation<FetcherResult<unknown>, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: false,
    onError: (error) => onError(error),
    onSuccess: (result) => toast.add({ type: 'success', title: result.message }),
  });
}

export function useCreateBrandMutation(options?: BrandMutationOptions) {
  return useBrandMutation<BrandInput>(createBrandAction, options);
}

export function useUpdateBrandMutation(options?: BrandMutationOptions) {
  return useBrandMutation<{ id: string } & UpdateBrandInput>(updateBrandAction, options);
}

export function useBrandStatusMutation(options?: BrandMutationOptions) {
  return useBrandMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableBrandAction : disableBrandAction)({ id }),
    options,
  );
}

export function useDeleteBrandMutation(options?: BrandMutationOptions) {
  return useBrandMutation<{ id: string }>(deleteBrandAction, options);
}

export function useCreateBrand(onSuccess: () => void) {
  const formRef = useRef<FormHandle<BrandInput>>(null);
  const { isPending, mutateAsync } = useCreateBrandMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: BrandInput) => {
      if (isPending) return;
      try {
        await mutateAsync(input);
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateBrand(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBrandInput>>(null);
  const { isPending, mutateAsync } = useUpdateBrandMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdateBrandInput) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, ...input });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useBrandStatus() {
  const { isPending, mutateAsync } = useBrandStatusMutation();
  const update = useCallback(
    async (id: string, enabled: boolean) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, enabled });
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync],
  );
  return { isPending, update } as const;
}

export function useDeleteBrand(onSuccess: () => void) {
  const { isPending, mutateAsync } = useDeleteBrandMutation();
  const remove = useCallback(
    async (id: string) => {
      if (isPending) return;
      try {
        await mutateAsync({ id });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { isPending, remove } as const;
}
