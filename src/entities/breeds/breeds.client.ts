'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createBreedAction,
  deleteBreedAction,
  disableBreedAction,
  enableBreedAction,
  replaceBreedPropertyDefinitionsAction,
  updateBreedAction,
} from './breeds.actions';
import type { BreedPropertyDefinitionsFormInput, UpdateBreedInput } from './breeds.schema';

type BreedMutationAction<TVariables> = (input: TVariables) => Promise<FetcherResult<unknown>>;
type BreedMutationOptions = {
  onError?: (error: FetcherError) => void;
  onSuccess?: () => void | Promise<void>;
};

/** Breed reads are Server Component data; EntityTag invalidation refreshes them. */
function useBreedMutation<TVariables>(
  action: BreedMutationAction<TVariables>,
  { onError = globalErrorHandler, onSuccess }: BreedMutationOptions = {},
) {
  return useMutation<FetcherResult<unknown>, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: false,
    onError: (error) => onError(error),
    onSuccess: async (result) => {
      toast.add({ type: 'success', title: result.message });
      await onSuccess?.();
    },
  });
}

export function useCreateBreedMutation(options?: BreedMutationOptions) {
  return useBreedMutation<UpdateBreedInput>(createBreedAction, options);
}

export function useUpdateBreedMutation(options?: BreedMutationOptions) {
  return useBreedMutation<{ id: string } & UpdateBreedInput>(updateBreedAction, options);
}

export function useReplaceBreedPropertyDefinitionsMutation(options?: BreedMutationOptions) {
  return useBreedMutation<{ id: string } & BreedPropertyDefinitionsFormInput>(
    replaceBreedPropertyDefinitionsAction,
    options,
  );
}

export function useBreedStatusMutation(options?: BreedMutationOptions) {
  return useBreedMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableBreedAction : disableBreedAction)({ id }),
    options,
  );
}

export function useDeleteBreedMutation(options?: BreedMutationOptions) {
  return useBreedMutation<{ id: string }>(deleteBreedAction, options);
}

export function useCreateBreed(onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBreedInput>>(null);
  const { isPending, mutateAsync } = useCreateBreedMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdateBreedInput) => {
      if (isPending) return;
      try {
        await mutateAsync(input);
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateBreed(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBreedInput>>(null);
  const { isPending, mutateAsync } = useUpdateBreedMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdateBreedInput) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, ...input });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useBreedStatus() {
  const { isPending, mutateAsync } = useBreedStatusMutation();
  const update = useCallback(
    async (id: string, enabled: boolean) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, enabled });
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync],
  );
  return { isPending, update } as const;
}

export function useReplaceBreedPropertyDefinitions(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<BreedPropertyDefinitionsFormInput>>(null);
  const { isPending, mutateAsync } = useReplaceBreedPropertyDefinitionsMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: BreedPropertyDefinitionsFormInput) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, ...input });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeleteBreed(onSuccess: () => void) {
  const { isPending, mutateAsync } = useDeleteBreedMutation();
  const remove = useCallback(
    async (id: string) => {
      if (isPending) return;
      try {
        await mutateAsync({ id });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { isPending, remove } as const;
}
