'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';
import {
  createProductAction,
  deleteProductAction,
  disableProductAction,
  enableProductAction,
  updateProductBaseInfoAction,
  updateProductImagesAction,
  updateProductPriceAction,
} from './products.actions';
import type {
  ProductInput,
  UpdateProductBaseInfoInput,
  UpdateProductImagesInput,
  UpdateProductPriceInput,
} from './products.schema';

async function submit<T extends FieldValues>(
  input: T,
  setError: UseFormSetError<T>,
  action: (value: T) => Promise<FetcherResult<unknown>>,
) {
  const result = await action(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields: setError });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}
export const submitCreateProduct = (input: ProductInput, setError: UseFormSetError<ProductInput>) =>
  submit(input, setError, createProductAction);
export const submitUpdateProductBaseInfo = (
  id: string,
  input: UpdateProductBaseInfoInput,
  setError: UseFormSetError<UpdateProductBaseInfoInput>,
) => submit({ id, ...input }, setError, updateProductBaseInfoAction);
export const submitUpdateProductImages = (
  id: string,
  input: UpdateProductImagesInput,
  setError: UseFormSetError<UpdateProductImagesInput>,
) => submit({ id, ...input }, setError, updateProductImagesAction);
export const submitUpdateProductPrice = (
  id: string,
  input: UpdateProductPriceInput,
  setError: UseFormSetError<UpdateProductPriceInput>,
) => submit({ id, ...input }, setError, updateProductPriceAction);
export async function submitProductEnabledUpdate(id: string, enabled: boolean) {
  const result = await (enabled ? enableProductAction : disableProductAction)({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}
export async function submitDeleteProduct(id: string) {
  const result = await deleteProductAction({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreateProduct(onSuccess: () => void) {
  const formRef = useRef<FormHandle<ProductInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: ProductInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreateProduct(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateProductBaseInfo(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateProductBaseInfoInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdateProductBaseInfoInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdateProductBaseInfo(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}
export function useUpdateProductImages(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateProductImagesInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdateProductImagesInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdateProductImages(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}
export function useUpdateProductPrice(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateProductPriceInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdateProductPriceInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdateProductPrice(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useProductRowActions(onSuccess: () => void) {
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
    enable: (id: string) => run(() => submitProductEnabledUpdate(id, true)),
    disable: (id: string) => run(() => submitProductEnabledUpdate(id, false)),
  } as const;
}
