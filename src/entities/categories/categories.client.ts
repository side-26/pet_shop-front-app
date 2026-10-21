'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  updateCategoryAction,
} from './categories.actions';
import type { CategoryInput, UpdateCategoryInput } from './categories.schema';

type Action<T> = (input: T) => Promise<FetcherResult<unknown>>;
type CategoryMutationOptions = {
  onError?: (error: FetcherError) => void;
};

/** Category reads are Server Component data; EntityTag invalidation refreshes them. */
function useCategoryMutation<T>(
  action: Action<T>,
  { onError = globalErrorHandler }: CategoryMutationOptions = {},
) {
  return useMutation<FetcherResult<unknown>, FetcherError, T>({
    mutationFn: async (input) => {
      const result = await action(input);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: false,
    onError: (error) => onError(error),
    onSuccess: (result) => toast.add({ type: 'success', title: result.message }),
  });
}

export function useCreateCategoryMutation(options?: CategoryMutationOptions) {
  return useCategoryMutation<CategoryInput>(createCategoryAction, options);
}

export function useUpdateCategoryMutation(options?: CategoryMutationOptions) {
  return useCategoryMutation<{ id: string } & UpdateCategoryInput>(updateCategoryAction, options);
}

export function useCategoryStatusMutation(options?: CategoryMutationOptions) {
  return useCategoryMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableCategoryAction : disableCategoryAction)({ id }),
    options,
  );
}

export function useDeleteCategoryMutation(options?: CategoryMutationOptions) {
  return useCategoryMutation<{ id: string }>(deleteCategoryAction, options);
}

export function useCreateCategory(onSuccess: () => void) {
  const formRef = useRef<FormHandle<CategoryInput>>(null);
  const { isPending, mutateAsync } = useCreateCategoryMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });

  const handleSubmit = useCallback(
    async (input: CategoryInput) => {
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

export function useUpdateCategory(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateCategoryInput>>(null);
  const { isPending, mutateAsync } = useUpdateCategoryMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });

  const handleSubmit = useCallback(
    async (input: UpdateCategoryInput) => {
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

export function useCategoryStatus() {
  const { isPending, mutateAsync } = useCategoryStatusMutation();
  return {
    isPending,
    update: async (id: string, enabled: boolean) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, enabled });
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
  } as const;
}

export function useDeleteCategory(onSuccess: () => void) {
  const { isPending, mutateAsync } = useDeleteCategoryMutation();
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
