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
import type { FetcherError } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
import type { RichTextDocument } from '@/lib/rich-text';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createPetTypeAction,
  deletePetTypeAction,
  disablePetTypeAction,
  enablePetTypeAction,
  rangePetTypePropertyDefinitionsAction,
  updatePetTypeAction,
} from './pet-types.actions';
import type {
  PetTypeInput,
  PetTypePropertyDefinitionsFormInput,
  UpdatePetTypeInput,
} from './pet-types.schema';

type PetTypeMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

function handleFormMutationError<TInput extends FieldValues>(
  error: FetcherError,
  form: FormHandle<TInput> | null,
) {
  globalErrorHandler<unknown, TInput>(error, form ? { showErrorFields: form.setError } : undefined);
}

/** Pet-type reads are Server Component data; service EntityTags refresh affected views. */
function usePetTypeMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: PetTypeMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export const useCreatePetTypeMutation = (options?: PetTypeMutationOptions<PetTypeInput>) =>
  usePetTypeMutation<PetTypeInput>(createPetTypeAction, options);
export const useUpdatePetTypeMutation = (
  options?: PetTypeMutationOptions<{ id: string } & UpdatePetTypeInput>,
) => usePetTypeMutation<{ id: string } & UpdatePetTypeInput>(updatePetTypeAction, options);
export const usePetTypePropertyDefinitionsMutation = (
  options?: PetTypeMutationOptions<{ id: string } & PetTypePropertyDefinitionsFormInput>,
) =>
  usePetTypeMutation<{ id: string } & PetTypePropertyDefinitionsFormInput>(
    rangePetTypePropertyDefinitionsAction,
    options,
  );
export const usePetTypeStatusMutation = (
  options?: PetTypeMutationOptions<{ id: string; enabled: boolean }>,
) =>
  usePetTypeMutation<{ id: string; enabled: boolean }>(
    ({ id, enabled }) => (enabled ? enablePetTypeAction : disablePetTypeAction)({ id }),
    options,
  );
export const useDeletePetTypeMutation = (options?: PetTypeMutationOptions<{ id: string }>) =>
  usePetTypeMutation<{ id: string }>(deletePetTypeAction, options);

async function prepareDescription<T extends { description?: unknown }>(
  input: T,
  onDescriptionUploaded?: (description: RichTextDocument) => void,
) {
  if (hasPendingRichTextImageOperations()) {
    toast.add({ type: 'warning', title: imageOperationMessages.pendingOperations });
    return null;
  }
  const description = await uploadRichTextImages(input.description as RichTextDocument);
  onDescriptionUploaded?.(description);
  return { ...input, description } as T;
}

export function useCreatePetType(onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetTypeInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useCreatePetTypeMutation({
    onError: (error) => handleFormMutationError(error, formRef.current),
  });
  const handleSubmit = useCallback(
    async (input: PetTypeInput) => {
      if (isPreparing || isPending) return;
      let prepared: PetTypeInput | null;
      setIsPreparing(true);
      try {
        prepared = await prepareDescription(input, (description) =>
          formRef.current?.setValue('description', description),
        );
      } catch (error) {
        handleFormMutationError(error as FetcherError, formRef.current);
        return;
      } finally {
        setIsPreparing(false);
      }
      if (!prepared) return;
      mutate(prepared, {
        onSuccess: () => {
          persistRichTextDraftImages(prepared.description as RichTextDocument);
          onSuccess();
        },
      });
    },
    [isPending, isPreparing, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending: isPreparing || isPending } as const;
}

export function useUpdatePetType(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetTypeInput>>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { isPending, mutate } = useUpdatePetTypeMutation({
    onError: (error) => handleFormMutationError(error, formRef.current),
  });
  const handleSubmit = useCallback(
    async (input: UpdatePetTypeInput) => {
      if (isPreparing || isPending) return;
      let prepared: UpdatePetTypeInput | null;
      setIsPreparing(true);
      try {
        prepared = await prepareDescription(input, (description) =>
          formRef.current?.setValue('description', description),
        );
      } catch (error) {
        handleFormMutationError(error as FetcherError, formRef.current);
        return;
      } finally {
        setIsPreparing(false);
      }
      if (!prepared) return;
      mutate(
        { id, ...prepared },
        {
          onSuccess: () => {
            persistRichTextDraftImages(prepared.description as RichTextDocument);
            onSuccess();
          },
        },
      );
    },
    [id, isPending, isPreparing, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending: isPreparing || isPending } as const;
}

export function useRangePetTypePropertyDefinitions(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetTypePropertyDefinitionsFormInput>>(null);
  const { isPending, mutate } = usePetTypePropertyDefinitionsMutation({
    onError: (error) => handleFormMutationError(error, formRef.current),
  });
  const handleSubmit = useCallback(
    (input: PetTypePropertyDefinitionsFormInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function usePetTypeStatus() {
  const { isPending, mutate } = usePetTypeStatusMutation();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      mutate({ id, enabled });
    },
    [isPending, mutate],
  );
  return { isPending, update } as const;
}

export function useDeletePetType(onSuccess: () => void) {
  const { isPending, mutate } = useDeletePetTypeMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
