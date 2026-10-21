'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { imageOperationMessages } from '@/configs/image-operation-messages';
import {
  hasPendingRichTextImageOperations,
  persistRichTextDraftImages,
  uploadRichTextImages,
} from '@/entities/images/images.client';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
import type { FetcherError } from '@/lib/api/customFetcher';
import { isRichTextDocument, type RichTextDocument } from '@/lib/rich-text';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createProductAction,
  deleteProductAction,
  disableProductAction,
  enableProductAction,
  replaceProductWeightsAction,
  updateProductBaseInfoAction,
  updateProductImagesAction,
  updateProductUserRateAction,
} from './products.actions';
import type {
  ProductInput,
  ReplaceProductWeightsInput,
  UpdateProductBaseInfoInput,
  UpdateProductImagesInput,
  UpdateProductUserRateInput,
} from './products.schema';

type ProductMutationOptions<TVariables> = ActionMutationOptions<TVariables>;
type ProductSectionVariables<TInput> = TInput & { id: string };

function useProductMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: ProductMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export function useCreateProductMutation(options?: ProductMutationOptions<ProductInput>) {
  return useProductMutation(createProductAction, options);
}

export function useUpdateProductBaseInfoMutation(
  options?: ProductMutationOptions<ProductSectionVariables<UpdateProductBaseInfoInput>>,
) {
  return useProductMutation(updateProductBaseInfoAction, options);
}

export function useUpdateProductImagesMutation(
  options?: ProductMutationOptions<ProductSectionVariables<UpdateProductImagesInput>>,
) {
  return useProductMutation(updateProductImagesAction, options);
}

export function useReplaceProductWeightsMutation(
  options?: ProductMutationOptions<
    ProductSectionVariables<Pick<ReplaceProductWeightsInput, 'weights'>>
  >,
) {
  return useProductMutation(replaceProductWeightsAction, options);
}

export function useProductStatusMutation(
  options?: ProductMutationOptions<{ id: string; enabled: boolean }>,
) {
  return useProductMutation(
    async ({ id, enabled }) => (enabled ? enableProductAction : disableProductAction)({ id }),
    options,
  );
}

export function useDeleteProductMutation(options?: ProductMutationOptions<{ id: string }>) {
  return useProductMutation(deleteProductAction, options);
}

export const productUserRateMutationKey = (productId: string) =>
  ['products', productId, 'user-rate'] as const;

export function useUpdateProductUserRate(productId: string) {
  return useProductMutation<UpdateProductUserRateInput>(updateProductUserRateAction, {
    mutationKey: productUserRateMutationKey(productId),
  });
}

async function prepareProductDescription<T extends FieldValues>(
  input: T,
  onError: (error: FetcherError) => void,
  onDescriptionUploaded?: (description: RichTextDocument) => void,
): Promise<T | null> {
  if (hasPendingRichTextImageOperations()) {
    toast.add({ type: 'warning', title: imageOperationMessages.pendingOperations });
    return null;
  }

  const description = (input as { description?: unknown }).description;
  if (!isRichTextDocument(description)) return input;

  try {
    const uploadedDescription = await uploadRichTextImages(description);
    onDescriptionUploaded?.(uploadedDescription);
    return { ...input, description: uploadedDescription };
  } catch (error) {
    onError(error as FetcherError);
    return null;
  }
}

function persistDescription(input: { description?: unknown }) {
  if (isRichTextDocument(input.description)) persistRichTextDraftImages(input.description);
}

export function useCreateProduct(onSuccess: () => void) {
  const formRef = useRef<FormHandle<ProductInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useCreateProductMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: ProductInput) => {
      const form = formRef.current;
      if (!form || isPreparing || isPending) return;

      setIsPreparing(true);
      const preparedInput = await prepareProductDescription(
        input,
        (error) => globalErrorHandler(error, { showErrorFields: form.setError }),
        (description) => form.setValue('description', description),
      );
      setIsPreparing(false);
      if (!preparedInput) return;

      mutate(preparedInput, {
        onSuccess: () => {
          persistDescription(preparedInput);
          onSuccess();
        },
      });
    },
    [isPending, isPreparing, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending: isPreparing || isPending } as const;
}

export function useUpdateProductBaseInfo(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateProductBaseInfoInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useUpdateProductBaseInfoMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdateProductBaseInfoInput) => {
      const form = formRef.current;
      if (!form || isPreparing || isPending) return;

      setIsPreparing(true);
      const preparedInput = await prepareProductDescription(
        input,
        (error) => globalErrorHandler(error, { showErrorFields: form.setError }),
        (description) => form.setValue('description', description),
      );
      setIsPreparing(false);
      if (!preparedInput) return;

      mutate(
        { id, ...preparedInput },
        {
          onSuccess: () => {
            persistDescription(preparedInput);
            onSuccess();
          },
        },
      );
    },
    [id, isPending, isPreparing, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending: isPreparing || isPending } as const;
}

export function useUpdateProductImages(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateProductImagesInput>>(null);
  const { isPending, mutate } = useUpdateProductImagesMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdateProductImagesInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useReplaceProductWeights(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<Pick<ReplaceProductWeightsInput, 'weights'>>>(null);
  const { isPending, mutate } = useReplaceProductWeightsMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: Pick<ReplaceProductWeightsInput, 'weights'>) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useProductRowActions(onSuccess: () => void) {
  const statusMutation = useProductStatusMutation();
  const isPending = statusMutation.isPending;

  const updateStatus = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      statusMutation.mutate({ id, enabled }, { onSuccess });
    },
    [isPending, onSuccess, statusMutation],
  );

  return {
    isPending,
    enable: (id: string) => updateStatus(id, true),
    disable: (id: string) => updateStatus(id, false),
  } as const;
}
