'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import { uploadRichTextImages } from '@/entities/images/images.client';
import {
  deletePetTypeAction,
  disablePetTypeAction,
  enablePetTypeAction,
} from './pet-types.actions';
import { createPetTypeAction } from './pet-types.actions';
import { updatePetTypeAction } from './pet-types.actions';
import { rangePetTypePropertyDefinitionsAction } from './pet-types.actions';
import type {
  PetTypeInput,
  PetTypePropertyDefinitionsFormInput,
  UpdatePetTypeInput,
} from './pet-types.schema';

type PetTypeRowAction =
  typeof enablePetTypeAction | typeof disablePetTypeAction | typeof deletePetTypeAction;

export function usePetTypeRowActions(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const run = useCallback(
    (action: PetTypeRowAction, id: string) => {
      if (isPending) return;
      startTransition(async () => {
        const result = await action({ id });
        if (!result.isSuccess) return globalErrorHandler(result);
        toast.add({ type: 'success', title: result.message });
        onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return {
    isPending,
    enable: (id: string) => run(enablePetTypeAction, id),
    disable: (id: string) => run(disablePetTypeAction, id),
    remove: (id: string) => run(deletePetTypeAction, id),
  } as const;
}

export async function submitCreatePetType(
  input: PetTypeInput,
  showErrorFields: UseFormSetError<PetTypeInput>,
) {
  try {
    input = { ...input, description: await uploadRichTextImages(input.description as never) };
  } catch (error) {
    globalErrorHandler(error as never, { showErrorFields });
    return false;
  }
  const result = await createPetTypeAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreatePetType(onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetTypeInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: PetTypeInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreatePetType(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdatePetType(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdatePetTypeInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdatePetTypeInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        try {
          input = { ...input, description: await uploadRichTextImages(input.description as never) };
        } catch (error) {
          return globalErrorHandler(error as never, { showErrorFields: form.setError });
        }
        const result = await updatePetTypeAction({ id, ...input });
        if (!result.isSuccess)
          return globalErrorHandler(result, { showErrorFields: form.setError });
        toast.add({ type: 'success', title: result.message });
        onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useRangePetTypePropertyDefinitions(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<PetTypePropertyDefinitionsFormInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: PetTypePropertyDefinitionsFormInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        const result = await rangePetTypePropertyDefinitionsAction({ id, ...input });
        if (!result.isSuccess) {
          globalErrorHandler(result, { showErrorFields: form.setError });
          return;
        }
        toast.add({ type: 'success', title: result.message });
        onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}
