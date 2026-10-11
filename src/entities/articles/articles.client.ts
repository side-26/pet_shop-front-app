'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { imageOperationMessages } from '@/configs/image-operation-messages';
import {
  hasPendingRichTextImageOperations,
  persistRichTextDraftImages,
  uploadRichTextImages,
} from '@/entities/images/images.client';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import type { RichTextDocument } from '@/lib/rich-text';
import { globalErrorHandler } from '@/utils/helpers';
import { transformData } from '@/app/core/transformer/transform';
import { useUpdateMainInfoDialogParams } from '@/app/admin/articles/_components/update-main-info-dialog/context';
import { useUpdateMainTextDialogParams } from '@/app/admin/articles/_components/update-main-text-dialog/context';
import { useUpdateTagsDialogParams } from '@/app/admin/articles/_components/update-tags-dialog/context';

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
import {
  ArticleDetailsDTO,
  ArticleMainTextDTO,
  ArticleTagDTO,
  type ArticleDetailsResponse,
  type ArticleIdDTO,
  type ArticleMainTextResponse,
  type ArticleTagResponse,
} from './articles.dto';
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

async function finalizeArticleMainText(
  mainText: UpdateArticleMainTextInput['mainText'],
  onError: (error: FetcherError) => void,
) {
  if (hasPendingRichTextImageOperations()) {
    toast.add({ type: 'warning', title: imageOperationMessages.pendingOperations });
    return;
  }

  try {
    return await uploadRichTextImages(mainText as RichTextDocument);
  } catch (error) {
    onError(error as FetcherError);
    return;
  }
}

export type UpdateArticleVariables = UpdateArticleInput & { id: string };
export type UpdateArticleMainTextVariables = UpdateArticleMainTextInput & { id: string };
export type ReplaceArticleTagsVariables = ReplaceArticleTagsInput & { id: string };
export type DeleteArticleVariables = { id: string };

export const articlesQueryKeys = {
  all: ['articles'] as const,
  mainInfo: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'main-info', id] as const,
  mainText: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'main-text', id] as const,
  tags: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'tags', id] as const,
};

const selectArticleMainInfo = (article: ArticleDetailsResponse) =>
  transformData(ArticleDetailsDTO, article);
const selectArticleMainText = (article: ArticleMainTextResponse) =>
  transformData(ArticleMainTextDTO, article);
const selectArticleTags = (tags: ArticleTagResponse[]): ArticleTagDTO[] =>
  transformData(ArticleTagDTO, tags as object[]);

export function useArticleMainInfoQuery() {
  const { id } = useUpdateMainInfoDialogParams();

  return useSuspenseQuery({
    queryKey: articlesQueryKeys.mainInfo(id),
    queryFn: ({ signal }) => articlesClientService.getById(id, signal),
    select: selectArticleMainInfo,
    retry: false,
  });
}

export function useArticleMainTextQuery() {
  const { id } = useUpdateMainTextDialogParams();

  return useSuspenseQuery({
    queryKey: articlesQueryKeys.mainText(id),
    queryFn: ({ signal }) => articlesClientService.getMainTextById(id, signal),
    select: selectArticleMainText,
    retry: false,
  });
}

export function useArticleTagsQuery() {
  const { id } = useUpdateTagsDialogParams();
  return useSuspenseQuery({
    queryKey: articlesQueryKeys.tags(id),
    queryFn: ({ signal }) => articlesClientService.getTagsById(id, signal),
    select: selectArticleTags,
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
          ...(input.petType === undefined ? {} : { petType: input.petType }),
        };
      });

      // The backend owns the resulting image URL, so reconcile this query after the local patch.
      await queryClient.invalidateQueries({ queryKey });
    },
  );
}

export function useUpdateArticleMainTextMutation(options?: ArticleMutationOptions) {
  const queryClient = useQueryClient();

  return useArticleMutation<UpdateArticleMainTextVariables>(
    updateArticleMainTextAction,
    options,
    async (_result, { id }) => {
      await queryClient.invalidateQueries({ queryKey: articlesQueryKeys.mainText(id) });
    },
  );
}

export function useReplaceArticleTagsMutation(options?: ArticleMutationOptions) {
  const queryClient = useQueryClient();

  return useArticleMutation<ReplaceArticleTagsVariables>(
    replaceArticleTagsAction,
    options,
    async (_result, { id }) => {
      await queryClient.invalidateQueries({ queryKey: articlesQueryKeys.tags(id) });
    },
  );
}

export function useDeleteArticleMutation(options?: ArticleMutationOptions) {
  return useArticleMutation<DeleteArticleVariables>(deleteArticleAction, options);
}

export function useDeleteArticle(onDeleted: () => void) {
  const { isPending, mutateAsync } = useDeleteArticleMutation();

  const deleteArticle = useCallback(
    async (id: string) => {
      await mutateAsync({ id });
      onDeleted();
    },
    [mutateAsync, onDeleted],
  );

  return { deleteArticle, isPending } as const;
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
      const form = formRef.current;
      const mainText = await finalizeArticleMainText(input.mainText, (error) =>
        globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined),
      );
      if (!mainText) return;
      form?.setValue('mainText', mainText);

      try {
        await mutateAsync({ ...input, mainText });
        persistRichTextDraftImages(mainText);
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

export function useUpdateArticleMainText(id: string, onUpdated: () => void) {
  const formRef = useRef<FormHandle<UpdateArticleMainTextInput>>(null);
  const mutation = useUpdateArticleMainTextMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const { isPending, mutateAsync } = mutation;

  const handleSubmit = useCallback(
    async (input: UpdateArticleMainTextInput) => {
      if (isPending) return;
      const form = formRef.current;
      const mainText = await finalizeArticleMainText(input.mainText, (error) =>
        globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined),
      );
      if (!mainText) return;
      form?.setValue('mainText', mainText);

      try {
        await mutateAsync({ id, ...input, mainText });
        persistRichTextDraftImages(mainText);
        onUpdated();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onUpdated],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateArticleTags(id: string, onUpdated: () => void) {
  const formRef = useRef<FormHandle<ReplaceArticleTagsInput>>(null);
  const mutation = useReplaceArticleTagsMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const { isPending, mutateAsync } = mutation;
  const handleSubmit = useCallback(
    async (input: ReplaceArticleTagsInput) => {
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
