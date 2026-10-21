'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import type { FetcherError } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
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

type BreedMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

/** Breed reads are Server Component data; EntityTag invalidation refreshes them. */
function useBreedMutation<TVariables>(
  action: ActionMutation<TVariables>,
  options?: BreedMutationOptions<TVariables>,
) {
  return useMutation(useMutationOptions(action, options));
}

export function useCreateBreedMutation(options?: BreedMutationOptions<UpdateBreedInput>) {
  return useBreedMutation<UpdateBreedInput>(createBreedAction, options);
}

export function useUpdateBreedMutation(
  options?: BreedMutationOptions<{ id: string } & UpdateBreedInput>,
) {
  return useBreedMutation<{ id: string } & UpdateBreedInput>(updateBreedAction, options);
}

export function useReplaceBreedPropertyDefinitionsMutation(
  options?: BreedMutationOptions<{ id: string } & BreedPropertyDefinitionsFormInput>,
) {
  return useBreedMutation<{ id: string } & BreedPropertyDefinitionsFormInput>(
    replaceBreedPropertyDefinitionsAction,
    options,
  );
}

export function useBreedStatusMutation(
  options?: BreedMutationOptions<{ id: string; enabled: boolean }>,
) {
  return useBreedMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) => (enabled ? enableBreedAction : disableBreedAction)({ id }),
    options,
  );
}

export function useDeleteBreedMutation(options?: BreedMutationOptions<{ id: string }>) {
  return useBreedMutation<{ id: string }>(deleteBreedAction, options);
}

export function useCreateBreed(onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBreedInput>>(null);
  const { isPending, mutate } = useCreateBreedMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdateBreedInput) => {
      if (isPending) return;
      mutate(input, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateBreed(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateBreedInput>>(null);
  const { isPending, mutate } = useUpdateBreedMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdateBreedInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useBreedStatus() {
  const { isPending, mutate } = useBreedStatusMutation();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      mutate({ id, enabled });
    },
    [isPending, mutate],
  );
  return { isPending, update } as const;
}

export function useReplaceBreedPropertyDefinitions(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<BreedPropertyDefinitionsFormInput>>(null);
  const { isPending, mutate } = useReplaceBreedPropertyDefinitionsMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: BreedPropertyDefinitionsFormInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeleteBreed(onSuccess: () => void) {
  const { isPending, mutate } = useDeleteBreedMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
