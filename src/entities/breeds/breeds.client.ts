'use client';
import { useCallback, useRef, useTransition } from 'react';
import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import {
  createBreedAction,
  disableBreedAction,
  enableBreedAction,
  replaceBreedPropertyDefinitionsAction,
  updateBreedAction,
} from './breeds.actions';
import type { BreedPropertyDefinitionsFormInput, UpdateBreedInput } from './breeds.schema';

function useBreedForm(onSuccess: () => void, id?: string) {
  const formRef = useRef<FormHandle<UpdateBreedInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdateBreedInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        const result = await (id ? updateBreedAction({ id, ...input }) : createBreedAction(input));
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
export function useCreateBreed(onSuccess: () => void) {
  return useBreedForm(onSuccess);
}
export function useUpdateBreed(id: string, onSuccess: () => void) {
  return useBreedForm(onSuccess, id);
}
export function useBreedStatus(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      startTransition(async () => {
        const result = await (enabled ? enableBreedAction : disableBreedAction)({ id });
        if (!result.isSuccess) return globalErrorHandler(result);
        toast.add({ type: 'success', title: result.message });
        onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { isPending, update } as const;
}
export function useReplaceBreedPropertyDefinitions(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<BreedPropertyDefinitionsFormInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: BreedPropertyDefinitionsFormInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        const result = await replaceBreedPropertyDefinitionsAction({ id, ...input });
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
