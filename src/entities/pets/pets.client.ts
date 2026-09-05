'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { uploadRichTextImages } from '@/entities/images/images.client';
import { isRichTextDocument } from '@/lib/rich-text';

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

export async function submitCreatePet(input: PetInput, setError: UseFormSetError<PetInput>) {
  try {
    input = { ...input, description: await uploadRichTextImages(input.description as never) };
  } catch (error) {
    globalErrorHandler(error as FetcherError, { showErrorFields: setError });
    return false;
  }
  const result = await createPetAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields: setError });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

async function submitPetSection<T extends FieldValues>(
  id: string,
  input: T,
  setError: UseFormSetError<T>,
  action: (input: T & { id: string }) => Promise<FetcherResult<unknown>>,
) {
  try {
    if (isRichTextDocument((input as { description?: unknown }).description)) {
      input = {
        ...input,
        description: await uploadRichTextImages(
          (input as unknown as { description: never }).description,
        ),
      };
    }
  } catch (error) {
    globalErrorHandler(error as FetcherError, { showErrorFields: setError });
    return false;
  }
  const result = await action({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields: setError });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export const submitUpdatePetBaseInfo = (
  id: string,
  input: UpdatePetBaseInfoInput,
  setError: UseFormSetError<UpdatePetBaseInfoInput>,
) => submitPetSection(id, input, setError, updatePetBaseInfoAction);

export const submitUpdatePetImages = (
  id: string,
  input: UpdatePetImagesInput,
  setError: UseFormSetError<UpdatePetImagesInput>,
) => submitPetSection(id, input, setError, updatePetImagesAction);

export const submitUpdatePetPrice = (
  id: string,
  input: UpdatePetPriceInput,
  setError: UseFormSetError<UpdatePetPriceInput>,
) => submitPetSection(id, input, setError, updatePetPriceAction);

export async function submitPetEnabledUpdate(id: string, enabled: boolean) {
  const result = await (enabled ? enablePetAction : disablePetAction)({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitDeletePet(id: string) {
  const result = await deletePetAction({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreatePet(onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: PetInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreatePet(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdatePetBaseInfo(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetBaseInfoInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdatePetBaseInfoInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdatePetBaseInfo(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdatePetImages(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetImagesInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdatePetImagesInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdatePetImages(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdatePetPrice(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetPriceInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdatePetPriceInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdatePetPrice(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function usePetRowActions(onSuccess: () => void) {
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
    enable: (id: string) => run(() => submitPetEnabledUpdate(id, true)),
    disable: (id: string) => run(() => submitPetEnabledUpdate(id, false)),
    remove: (id: string) => run(() => submitDeletePet(id)),
  } as const;
}
