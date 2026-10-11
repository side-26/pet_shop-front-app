'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';
import { transformData } from '@/app/core/transformer/transform';
import { useUpdateMainInfoDialogParams } from '@/app/admin/articles/_components/update-main-info-dialog/context';

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
import { ArticleDetailsDTO, type ArticleDetailsResponse, type ArticleIdDTO } from './articles.dto';
import { articlesClientService } from './articles.client-service';

type ArticleMutationOptions = Readonly<{
  onError?: (error: FetcherError) => void;
}>;
type ArticleMutationAction<TVariables> = (variables: TVariables) => Promise<FetcherResult<unknown>>;
type ArticleMutationSuccessHandler<TVariables> = (
  result: FetcherResult<unknown>,
  variables: TVariables,
) => void | Promise<void>;

function reportMutationError(error: FetcherError) {
  globalErrorHandler(error);
}

export type UpdateArticleVariables = UpdateArticleInput & { id: string };
export type UpdateArticleMainTextVariables = UpdateArticleMainTextInput & { id: string };
export type ReplaceArticleTagsVariables = ReplaceArticleTagsInput & { id: string };
export type DeleteArticleVariables = { id: string };

export const articlesQueryKeys = {
  all: ['articles'] as const,
  mainInfo: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'main-info', id] as const,
};

const selectArticleMainInfo = (article: ArticleDetailsResponse) =>
  transformData(ArticleDetailsDTO, article);

export function useArticleMainInfoQuery() {
  const { id } = useUpdateMainInfoDialogParams();

  return useSuspenseQuery({
    queryKey: articlesQueryKeys.mainInfo(id),
    queryFn: ({ signal }) => articlesClientService.getById(id, signal),
    select: selectArticleMainInfo,
    retry: false,
  });
}

function useArticleMutation<TVariables>(
  action: ArticleMutationAction<TVariables>,
  { onError = reportMutationError }: ArticleMutationOptions = {},
  onSuccess?: ArticleMutationSuccessHandler<TVariables>,
) {
  return useMutation<FetcherResult<unknown>, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: 0,
    onSuccess: async (result, variables) => {
      toast.add({ type: 'success', title: result.message });
      await onSuccess?.(result, variables);
    },
    onError,
  });
}

export function useCreateArticleMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<CreateArticleInput>(createArticleAction, options);
}

export function useUpdateArticleMutation(options?: ArticleMutationOptions) {
  const queryClient = useQueryClient();

  return useArticleMutation<UpdateArticleVariables>(
    updateArticleAction,
    options,
    async (_result, input) => {
      const queryKey = articlesQueryKeys.mainInfo(input.id);

      queryClient.setQueryData<ArticleDetailsResponse>(queryKey, (article) => {
        if (!article) return article;

        return {
          ...article,
          ...(input.title === undefined ? {} : { title: input.title }),
          ...(input.subtitle === undefined ? {} : { subtitle: input.subtitle }),
          ...(input.petType === undefined ? {} : { petTypeId: input.petType }),
        };
      });

      // The backend owns the resulting image URL, so reconcile this query after the local patch.
      await queryClient.invalidateQueries({ queryKey });
    },
  );
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

export function useUpdateArticle(id: string, onUpdated: () => void) {
  const formRef = useRef<FormHandle<UpdateArticleInput>>(null);
  const mutation = useUpdateArticleMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const { isPending, mutateAsync } = mutation;

  const handleSubmit = useCallback(
    async (input: UpdateArticleInput) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, ...input });
        onUpdated();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onUpdated],
  );

  return { formRef, handleSubmit, isPending } as const;
}
