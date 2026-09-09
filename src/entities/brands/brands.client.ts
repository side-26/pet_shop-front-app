'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createBrandAction,
  deleteBrandAction,
  disableBrandAction,
  enableBrandAction,
  updateBrandAction,
} from './brands.actions';
import type { BrandInput, UpdateBrandInput } from './brands.schema';

export async function submitCreateBrand(
  input: BrandInput,
  showErrorFields: UseFormSetError<BrandInput>,
) {
  const result = await createBrandAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitUpdateBrand(
  id: string,
  input: UpdateBrandInput,
  showErrorFields: UseFormSetError<UpdateBrandInput>,
) {
  const result = await updateBrandAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

async function submitById<T>(id: string, action: (input: unknown) => Promise<FetcherResult<T>>) {
  const result = await action({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export const submitBrandEnabledUpdate = (id: string, enabled: boolean) =>
  submitById(id, enabled ? enableBrandAction : disableBrandAction);
export const submitDeleteBrand = (id: string) => submitById(id, deleteBrandAction);

export function useCreateBrand(onSuccess: () => void) {
  const formRef = useRef<FormHandle<BrandInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: BrandInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreateBrand(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateBrand(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBrandInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: UpdateBrandInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        if (await submitUpdateBrand(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useBrandStatus(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;

      startTransition(async () => {
        if (await submitBrandEnabledUpdate(id, enabled)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { isPending, update } as const;
}
