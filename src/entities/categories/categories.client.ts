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
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  updateCategoryAction,
} from './categories.actions';
import type { CategoryInput, UpdateCategoryInput } from './categories.schema';

type CategoryMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

/** Category reads are Server Component data; EntityTag invalidation refreshes them. */
function useCategoryMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: CategoryMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export function useCreateCategoryMutation(options?: CategoryMutationOptions<CategoryInput>) {
  return useCategoryMutation<CategoryInput>(createCategoryAction, options);
}

export function useUpdateCategoryMutation(
  options?: CategoryMutationOptions<{ id: string } & UpdateCategoryInput>,
) {
  return useCategoryMutation<{ id: string } & UpdateCategoryInput>(updateCategoryAction, options);
}

export function useCategoryStatusMutation(
  options?: CategoryMutationOptions<{ id: string; enabled: boolean }>,
) {
  return useCategoryMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableCategoryAction : disableCategoryAction)({ id }),
    options,
  );
}

export function useDeleteCategoryMutation(options?: CategoryMutationOptions<{ id: string }>) {
  return useCategoryMutation<{ id: string }>(deleteCategoryAction, options);
}

export function useCreateCategory(onSuccess: () => void) {
  const formRef = useRef<FormHandle<CategoryInput>>(null);
  const { isPending, mutate } = useCreateCategoryMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });

  const handleSubmit = useCallback(
    (input: CategoryInput) => {
      if (isPending) return;
      mutate(input, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateCategory(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateCategoryInput>>(null);
  const { isPending, mutate } = useUpdateCategoryMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });

  const handleSubmit = useCallback(
    (input: UpdateCategoryInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useCategoryStatus() {
  const { isPending, mutate } = useCategoryStatusMutation();
  return {
    isPending,
    update: (id: string, enabled: boolean) => {
      if (isPending) return;
      mutate({ id, enabled });
    },
  } as const;
}

export function useDeleteCategory(onSuccess: () => void) {
  const { isPending, mutate } = useDeleteCategoryMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
