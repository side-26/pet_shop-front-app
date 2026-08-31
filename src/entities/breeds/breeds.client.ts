'use client';
import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';
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
import type { BreedInput, BreedPropertyDefinitionsFormInput } from './breeds.schema';
export function useBreedForm(onSuccess: () => void, id?: string) {
  const formRef = useRef<FormHandle<BreedInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: BreedInput) => {
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
