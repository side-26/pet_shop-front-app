'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  updateSubCategoryAction,
} from './sub-categories.actions';
import type { SubCategoryInput, UpdateSubCategoryInput } from './sub-categories.schema';

export async function submitCreateSubCategory(
  input: SubCategoryInput,
  showErrorFields: UseFormSetError<SubCategoryInput>,
) {
  const result = await createSubCategoryAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitUpdateSubCategory(
  id: string,
  input: UpdateSubCategoryInput,
  showErrorFields: UseFormSetError<UpdateSubCategoryInput>,
) {
  const result = await updateSubCategoryAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitDeleteSubCategory(id: string) {
  const result = await deleteSubCategoryAction({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreateSubCategory(onSuccess: () => void) {
  const formRef = useRef<FormHandle<SubCategoryInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: SubCategoryInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        if (await submitCreateSubCategory(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateSubCategory(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateSubCategoryInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: UpdateSubCategoryInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        if (await submitUpdateSubCategory(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useSubCategoryRowActions(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();

  const remove = useCallback(
    (id: string) => {
      if (isPending) return;

      startTransition(async () => {
        if (await submitDeleteSubCategory(id)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { isPending, remove } as const;
}
