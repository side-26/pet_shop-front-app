'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import type { FetcherError } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createBrandAction,
  deleteBrandAction,
  disableBrandAction,
  enableBrandAction,
  updateBrandAction,
} from './brands.actions';
import type { BrandInput, UpdateBrandInput } from './brands.schema';

type BrandMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

/** Brand reads are Server Component data; EntityTag invalidation refreshes them. */
function useBrandMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: BrandMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export function useCreateBrandMutation(options?: BrandMutationOptions<BrandInput>) {
  return useBrandMutation<BrandInput>(createBrandAction, options);
}

export function useUpdateBrandMutation(
  options?: BrandMutationOptions<{ id: string } & UpdateBrandInput>,
) {
  return useBrandMutation<{ id: string } & UpdateBrandInput>(updateBrandAction, options);
}

export function useBrandStatusMutation(
  options?: BrandMutationOptions<{ id: string; enabled: boolean }>,
) {
  return useBrandMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableBrandAction : disableBrandAction)({ id }),
    options,
  );
}

export function useDeleteBrandMutation(options?: BrandMutationOptions<{ id: string }>) {
  return useBrandMutation<{ id: string }>(deleteBrandAction, options);
}

export function useCreateBrand(onSuccess: () => void) {
  const formRef = useRef<FormHandle<BrandInput>>(null);
  const { isPending, mutate } = useCreateBrandMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: BrandInput) => {
      if (isPending) return;
      mutate(input, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateBrand(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBrandInput>>(null);
  const { isPending, mutate } = useUpdateBrandMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdateBrandInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useBrandStatus() {
  const { isPending, mutate } = useBrandStatusMutation();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      mutate({ id, enabled });
    },
    [isPending, mutate],
  );
  return { isPending, update } as const;
}

export function useDeleteBrand(onSuccess: () => void) {
  const { isPending, mutate } = useDeleteBrandMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
