'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  updateCategoryAction,
} from './categories.actions';
import type { CategoryInput, UpdateCategoryInput } from './categories.schema';

export async function submitCreateCategory(
  input: CategoryInput,
  showErrorFields: UseFormSetError<CategoryInput>,
) {
  const result = await createCategoryAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitUpdateCategory(
  id: string,
  input: UpdateCategoryInput,
  showErrorFields: UseFormSetError<UpdateCategoryInput>,
) {
  const result = await updateCategoryAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitCategoryEnabledUpdate(id: string, enabled: boolean) {
  const result = await (enabled ? enableCategoryAction : disableCategoryAction)({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitDeleteCategory(id: string) {
  const result = await deleteCategoryAction({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreateCategory(onSuccess: () => void) {
  const formRef = useRef<FormHandle<CategoryInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: CategoryInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        if (await submitCreateCategory(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateCategory(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateCategoryInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: UpdateCategoryInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        if (await submitUpdateCategory(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useCategoryRowActions(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();

  const run = useCallback(
    (action: () => Promise<boolean>) => {
      if (isPending) return;
      startTransition(async () => {
        if (await action()) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return {
    isPending,
    enable: (id: string) => run(() => submitCategoryEnabledUpdate(id, true)),
    disable: (id: string) => run(() => submitCategoryEnabledUpdate(id, false)),
    remove: (id: string) => run(() => submitDeleteCategory(id)),
  } as const;
}
