'use client';

import type { FieldValues, UseFormSetError } from 'react-hook-form';

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
