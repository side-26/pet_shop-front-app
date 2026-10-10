'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createArticleAction,
  deleteArticleAction,
  replaceArticleTagsAction,
  updateArticleAction,
  updateArticleMainTextAction,
} from './articles.actions';
import type {
  CreateArticleInput,
  ReplaceArticleTagsInput,
  UpdateArticleInput,
  UpdateArticleMainTextInput,
} from './articles.schema';

type ArticleMutationOptions = Readonly<{
  onError?: (error: FetcherError) => void;
}>;
type ArticleMutationAction<TVariables> = (variables: TVariables) => Promise<FetcherResult<unknown>>;

function reportMutationError(error: FetcherError) {
  globalErrorHandler(error);
}

export type UpdateArticleVariables = UpdateArticleInput & { id: string };
export type UpdateArticleMainTextVariables = UpdateArticleMainTextInput & { id: string };
export type ReplaceArticleTagsVariables = ReplaceArticleTagsInput & { id: string };
export type DeleteArticleVariables = { id: string };

function useArticleMutation<TVariables>(
  action: ArticleMutationAction<TVariables>,
  { onError = reportMutationError }: ArticleMutationOptions = {},
) {
  return useMutation<FetcherResult<unknown>, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: 0,
    onSuccess: (result) => toast.add({ type: 'success', title: result.message }),
    onError,
  });
}

export function useCreateArticleMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<CreateArticleInput>(createArticleAction, options);
}

export function useUpdateArticleMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<UpdateArticleVariables>(updateArticleAction, options);
}

export function useUpdateArticleMainTextMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<UpdateArticleMainTextVariables>(updateArticleMainTextAction, options);
}

export function useReplaceArticleTagsMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<ReplaceArticleTagsVariables>(replaceArticleTagsAction, options);
}

export function useDeleteArticleMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<DeleteArticleVariables>(deleteArticleAction, options);
}

export function useCreateArticle(onCreated: () => void) {
  const formRef = useRef<FormHandle<CreateArticleInput>>(null);
  const mutation = useCreateArticleMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const { isPending, mutateAsync } = mutation;

  const handleSubmit = useCallback(
    async (input: CreateArticleInput) => {
      if (isPending) return;
      try {
        await mutateAsync(input);
        onCreated();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onCreated],
  );

  return { formRef, handleSubmit, isPending } as const;
}
