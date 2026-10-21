'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import type { FetcherError } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  updateSubCategoryAction,
} from './sub-categories.actions';
import type { SubCategoryInput, UpdateSubCategoryInput } from './sub-categories.schema';

type SubCategoryMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

function handleFormMutationError<TInput extends FieldValues>(
  error: FetcherError,
  form: FormHandle<TInput> | null,
) {
  globalErrorHandler<unknown, TInput>(error, form ? { showErrorFields: form.setError } : undefined);
}

/** Sub-category reads are Server Component data; service EntityTags refresh affected views. */
function useSubCategoryMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: SubCategoryMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export const useCreateSubCategoryMutation = (
  options?: SubCategoryMutationOptions<SubCategoryInput>,
) => useSubCategoryMutation<SubCategoryInput>(createSubCategoryAction, options);
export const useUpdateSubCategoryMutation = (
  options?: SubCategoryMutationOptions<{ id: string } & UpdateSubCategoryInput>,
) =>
  useSubCategoryMutation<{ id: string } & UpdateSubCategoryInput>(updateSubCategoryAction, options);
export const useDeleteSubCategoryMutation = (
  options?: SubCategoryMutationOptions<{ id: string }>,
) => useSubCategoryMutation<{ id: string }>(deleteSubCategoryAction, options);

export function useCreateSubCategory(onSuccess: () => void) {
  const formRef = useRef<FormHandle<SubCategoryInput>>(null);
  const { isPending, mutate } = useCreateSubCategoryMutation({
    onError: (error) => handleFormMutationError(error, formRef.current),
  });
  const handleSubmit = useCallback(
    (input: SubCategoryInput) => {
      if (isPending) return;
      mutate(input, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateSubCategory(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateSubCategoryInput>>(null);
  const { isPending, mutate } = useUpdateSubCategoryMutation({
    onError: (error) => handleFormMutationError(error, formRef.current),
  });
  const handleSubmit = useCallback(
    (input: UpdateSubCategoryInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeleteSubCategory(onSuccess: () => void) {
  const { isPending, mutate } = useDeleteSubCategoryMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
