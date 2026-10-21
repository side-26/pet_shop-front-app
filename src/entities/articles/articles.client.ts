'use client';

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { imageOperationMessages } from '@/configs/image-operation-messages';
import {
  hasPendingRichTextImageOperations,
  persistRichTextDraftImages,
  uploadRichTextImages,
} from '@/entities/images/images.client';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
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
  type ArticleListDTO,
  type ArticlePaginatedResponse,
  type ArticleDetailsResponse,
  type ArticleIdDTO,
  type ArticleMainTextResponse,
  type ArticlePaginationDTO,
  type ArticleTagResponse,
} from './articles.dto';
import { articlesClientService } from './articles.client-service';

type ArticleMutationOptions<TVariables> = ActionMutationOptions<TVariables>;
type ArticleMutationSuccessHandler<TVariables> = (
  result: FetcherResult<unknown>,
  variables: TVariables,
) => void | Promise<void>;

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
  catalogPrefix: ['articles', 'catalog'] as const,
  mainInfo: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'main-info', id] as const,
  mainText: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'main-text', id] as const,
  tags: (id: ArticleIdDTO['id']) => [...articlesQueryKeys.all, 'tags', id] as const,
  catalog: (query: Readonly<Record<string, string>>) =>
    [
      ...articlesQueryKeys.catalogPrefix,
      new URLSearchParams(Object.entries(query).sort()).toString(),
    ] as const,
};

function toArticleCatalogRequest(
  query: Readonly<Record<string, string>>,
  page: number,
  limit: number,
): Partial<ArticlePaginationDTO> {
  return {
    page,
    limit,
    ...(query.sort ? { sort: query.sort as ArticlePaginationDTO['sort'] } : {}),
    ...(query.petType ? { petType: query.petType } : {}),
    ...(query.tags
      ? {
          tags: query.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }
      : {}),
  };
}

export function useSuspenseArticleCatalogInfiniteQuery(
  initialPage: ArticlePaginatedResponse,
  query: Readonly<Record<string, string>>,
) {
  const infiniteQuery = useSuspenseInfiniteQuery({
    queryKey: articlesQueryKeys.catalog(query),
    queryFn: ({ pageParam, signal }) =>
      articlesClientService.getPaginated(
        toArticleCatalogRequest(query, pageParam, initialPage.pagination.itemsPerPage),
        signal,
      ),
    initialPageParam: initialPage.pagination.currentPage,
    initialData: {
      pages: [initialPage],
      pageParams: [initialPage.pagination.currentPage],
    },
    getNextPageParam: (page) => page?.pagination.nextPage ?? undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const articles = useMemo(() => {
    const uniqueArticles = new Map<string, ArticleListDTO>();
    infiniteQuery.data.pages
      .flatMap((page) => page.result)
      .forEach((article) => uniqueArticles.set(article.id, article));
    return [...uniqueArticles.values()];
  }, [infiniteQuery.data.pages]);

  return { ...infiniteQuery, articles };
}
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
  action: ActionMutation<TVariables>,
  { onSuccess, ...options }: ArticleMutationOptions<TVariables> = {},
  onEntitySuccess?: ArticleMutationSuccessHandler<TVariables>,
) {
  return useMutation(
    useMutationOptions(action, {
      ...options,
      onSuccess: async (result, variables, context, mutationContext) => {
        await onEntitySuccess?.(result, variables);
        await onSuccess?.(result, variables, context, mutationContext);
      },
    }),
  );
}

export function useCreateArticleMutation(options?: ArticleMutationOptions<CreateArticleInput>) {
  const queryClient = useQueryClient();

  return useArticleMutation<CreateArticleInput>(createArticleAction, options, async () => {
    await queryClient.invalidateQueries({ queryKey: articlesQueryKeys.catalogPrefix });
  });
}

export function useUpdateArticleMutation(options?: ArticleMutationOptions<UpdateArticleVariables>) {
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: articlesQueryKeys.catalogPrefix }),
      ]);
    },
  );
}

export function useUpdateArticleMainTextMutation(
  options?: ArticleMutationOptions<UpdateArticleMainTextVariables>,
) {
  const queryClient = useQueryClient();

  return useArticleMutation<UpdateArticleMainTextVariables>(
    updateArticleMainTextAction,
    options,
    async (_result, { id }) => {
      await queryClient.invalidateQueries({ queryKey: articlesQueryKeys.mainText(id) });
    },
  );
}

export function useReplaceArticleTagsMutation(
  options?: ArticleMutationOptions<ReplaceArticleTagsVariables>,
) {
  const queryClient = useQueryClient();

  return useArticleMutation<ReplaceArticleTagsVariables>(
    replaceArticleTagsAction,
    options,
    async (_result, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: articlesQueryKeys.tags(id) }),
        queryClient.invalidateQueries({ queryKey: articlesQueryKeys.catalogPrefix }),
      ]);
    },
  );
}

export function useDeleteArticleMutation(options?: ArticleMutationOptions<DeleteArticleVariables>) {
  const queryClient = useQueryClient();

  return useArticleMutation<DeleteArticleVariables>(deleteArticleAction, options, async () => {
    await queryClient.invalidateQueries({ queryKey: articlesQueryKeys.catalogPrefix });
  });
}

export function useDeleteArticle(onDeleted: () => void) {
  const { isPending, mutate } = useDeleteArticleMutation();

  const deleteArticle = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess: onDeleted });
    },
    [isPending, mutate, onDeleted],
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
  const { isPending, mutate } = mutation;

  const handleSubmit = useCallback(
    async (input: CreateArticleInput) => {
      if (isPending) return;
      const form = formRef.current;
      const mainText = await finalizeArticleMainText(input.mainText, (error) =>
        globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined),
      );
      if (!mainText) return;
      form?.setValue('mainText', mainText);

      mutate(
        { ...input, mainText },
        {
          onSuccess: () => {
            persistRichTextDraftImages(mainText);
            onCreated();
          },
        },
      );
    },
    [isPending, mutate, onCreated],
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
  const { isPending, mutate } = mutation;

  const handleSubmit = useCallback(
    async (input: UpdateArticleInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess: onUpdated });
    },
    [id, isPending, mutate, onUpdated],
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
  const { isPending, mutate } = mutation;

  const handleSubmit = useCallback(
    async (input: UpdateArticleMainTextInput) => {
      if (isPending) return;
      const form = formRef.current;
      const mainText = await finalizeArticleMainText(input.mainText, (error) =>
        globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined),
      );
      if (!mainText) return;
      form?.setValue('mainText', mainText);

      mutate(
        { id, ...input, mainText },
        {
          onSuccess: () => {
            persistRichTextDraftImages(mainText);
            onUpdated();
          },
        },
      );
    },
    [id, isPending, mutate, onUpdated],
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
  const { isPending, mutate } = mutation;
  const handleSubmit = useCallback(
    async (input: ReplaceArticleTagsInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess: onUpdated });
    },
    [id, isPending, mutate, onUpdated],
  );
  return { formRef, handleSubmit, isPending } as const;
}
