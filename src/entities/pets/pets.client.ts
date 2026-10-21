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
  createPetAction,
  deletePetAction,
  disablePetAction,
  enablePetAction,
  updatePetBaseInfoAction,
  updatePetImagesAction,
  updatePetPriceAction,
} from './pets.actions';
import type {
  PetInput,
  UpdatePetBaseInfoInput,
  UpdatePetImagesInput,
  UpdatePetPriceInput,
} from './pets.schema';

type PetMutationOptions<TVariables> = ActionMutationOptions<TVariables>;
type PetSectionVariables<TInput> = TInput & { id: string };

function usePetMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: PetMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export function useCreatePetMutation(options?: PetMutationOptions<PetInput>) {
  return usePetMutation(createPetAction, options);
}

export function useUpdatePetBaseInfoMutation(
  options?: PetMutationOptions<PetSectionVariables<UpdatePetBaseInfoInput>>,
) {
  return usePetMutation(updatePetBaseInfoAction, options);
}

export function useUpdatePetImagesMutation(
  options?: PetMutationOptions<PetSectionVariables<UpdatePetImagesInput>>,
) {
  return usePetMutation(updatePetImagesAction, options);
}

export function useUpdatePetPriceMutation(
  options?: PetMutationOptions<PetSectionVariables<UpdatePetPriceInput>>,
) {
  return usePetMutation(updatePetPriceAction, options);
}

export function usePetStatusMutation(
  options?: PetMutationOptions<{ id: string; enabled: boolean }>,
) {
  return usePetMutation(
    async ({ id, enabled }) => (enabled ? enablePetAction : disablePetAction)({ id }),
    options,
  );
}

export function useDeletePetMutation(options?: PetMutationOptions<{ id: string }>) {
  return usePetMutation(deletePetAction, options);
}

async function preparePetDescription<T extends FieldValues>(
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

export function useCreatePet(onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useCreatePetMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: PetInput) => {
      const form = formRef.current;
      if (!form || isPreparing || isPending) return;

      setIsPreparing(true);
      const preparedInput = await preparePetDescription(
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

export function useUpdatePetBaseInfo(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetBaseInfoInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useUpdatePetBaseInfoMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdatePetBaseInfoInput) => {
      const form = formRef.current;
      if (!form || isPreparing || isPending) return;

      setIsPreparing(true);
      const preparedInput = await preparePetDescription(
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

export function useUpdatePetImages(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetImagesInput>>(null);
  const { isPending, mutate } = useUpdatePetImagesMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdatePetImagesInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdatePetPrice(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetPriceInput>>(null);
  const { isPending, mutate } = useUpdatePetPriceMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdatePetPriceInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function usePetRowActions(onSuccess: () => void) {
  const statusMutation = usePetStatusMutation();
  const deleteMutation = useDeletePetMutation();
  const isPending = statusMutation.isPending || deleteMutation.isPending;

  const updateStatus = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      statusMutation.mutate({ id, enabled }, { onSuccess });
    },
    [isPending, onSuccess, statusMutation],
  );
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      deleteMutation.mutate({ id }, { onSuccess });
    },
    [deleteMutation, isPending, onSuccess],
  );

  return {
    isPending,
    enable: (id: string) => updateStatus(id, true),
    disable: (id: string) => updateStatus(id, false),
    remove,
  } as const;
}
