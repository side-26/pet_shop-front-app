import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, Suspense, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import {
  hasPendingRichTextImageOperations,
  persistRichTextDraftImages,
  uploadRichTextImages,
} from '@/entities/images/images.client';
import { globalErrorHandler } from '@/utils/helpers';
import { UpdateMainInfoDialogContext } from '@/app/admin/articles/_components/update-main-info-dialog/context';
import { UpdateMainTextDialogContext } from '@/app/admin/articles/_components/update-main-text-dialog/context';
import { UpdateTagsDialogContext } from '@/app/admin/articles/_components/update-tags-dialog/context';

import {
  createArticleAction,
  deleteArticleAction,
  replaceArticleTagsAction,
  updateArticleAction,
  updateArticleMainTextAction,
} from './articles.actions';
import {
  articlesQueryKeys,
  useArticleMainInfoQuery,
  useArticleMainTextQuery,
  useArticleTagsQuery,
  useCreateArticle,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useSuspenseArticleCatalogInfiniteQuery,
  useReplaceArticleTagsMutation,
  useUpdateArticleMainTextMutation,
  useUpdateArticleMainText,
  useUpdateArticleMutation,
} from './articles.client';
import { articlesClientService } from './articles.client-service';
import {
  ArticleDetailsDTO,
  ArticleMainTextDTO,
  ArticleTagDTO,
  type ArticlePaginatedResponse,
} from './articles.dto';

vi.mock('./articles.actions', () => ({
  createArticleAction: vi.fn(),
  deleteArticleAction: vi.fn(),
  updateArticleAction: vi.fn(),
  updateArticleMainTextAction: vi.fn(),
  replaceArticleTagsAction: vi.fn(),
}));
vi.mock('./articles.client-service', () => ({
  articlesClientService: {
    getById: vi.fn(),
    getMainTextById: vi.fn(),
    getTagsById: vi.fn(),
    getPaginated: vi.fn(),
  },
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/entities/images/images.client', () => ({
  hasPendingRichTextImageOperations: vi.fn(),
  persistRichTextDraftImages: vi.fn(),
  uploadRichTextImages: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439011';
const createInput = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: new File(['image'], 'dog.webp', { type: 'image/webp' }),
  mainText: { type: 'doc' as const, content: [] },
};
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: {}, details: {} },
};
const success = { isSuccess: true as const, message: 'موفق', data: {} as never };
const initialCatalogPage: ArticlePaginatedResponse = {
  result: [],
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalItems: 12,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null,
  },
  metadata: { tags: [], petTypes: [], sort: { current: 'newest', options: [] } },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, wrapper };
}

function createSuspenseWrapper() {
  const { queryClient, wrapper: QueryProvider } = createWrapper();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      QueryProvider,
      null,
      createElement(
        UpdateMainInfoDialogContext,
        { value: { id } },
        createElement(Suspense, { fallback: null }, children),
      ),
    );
  return { queryClient, wrapper };
}

function createMainTextSuspenseWrapper() {
  const { queryClient, wrapper: QueryProvider } = createWrapper();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      QueryProvider,
      null,
      createElement(
        UpdateMainTextDialogContext,
        { value: { id } },
        createElement(Suspense, { fallback: null }, children),
      ),
    );
  return { queryClient, wrapper };
}

describe('article client mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hasPendingRichTextImageOperations).mockReturnValue(false);
  });

  it.each([
    ['creates an article', useCreateArticleMutation, createArticleAction, createInput],
    [
      'updates an article',
      useUpdateArticleMutation,
      updateArticleAction,
      { id, summary: 'خلاصه تازه' },
    ],
    [
      'updates article text',
      useUpdateArticleMainTextMutation,
      updateArticleMainTextAction,
      { id, mainText: createInput.mainText },
    ],
    [
      'replaces article tags',
      useReplaceArticleTagsMutation,
      replaceArticleTagsAction,
      { id, tags: [{ title: 'سگ' }] },
    ],
    ['deletes an article', useDeleteArticleMutation, deleteArticleAction, { id }],
  ] as const)('%s through its Server Action', async (_label, useArticleHook, action, input) => {
    vi.mocked(action).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useArticleHook(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(input as never);
    });

    expect(action).toHaveBeenCalledWith(input);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'موفق' });
    queryClient.clear();
  });

  it('forwards a complete failed action result and does not show a success toast', async () => {
    vi.mocked(createArticleAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateArticleMutation(), { wrapper });

    act(() => result.current.mutate(createInput));
    await act(async () => undefined);

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(toast.add).not.toHaveBeenCalled();
    queryClient.clear();
  });

  it('patches and refreshes only the matching main-info cache entry after an update', async () => {
    vi.mocked(updateArticleAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const queryKey = articlesQueryKeys.mainInfo(id);
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    queryClient.setQueryData(queryKey, {
      id,
      title: 'عنوان قبلی',
      subtitle: 'زیرعنوان قبلی',
      mainImage: 'https://cdn.example.test/articles/old.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      petType: null,
    });

    const { result } = renderHook(() => useUpdateArticleMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id,
        title: 'عنوان جدید',
        petType: '507f1f77bcf86cd799439012',
      });
    });

    expect(queryClient.getQueryData(queryKey)).toMatchObject({
      title: 'عنوان جدید',
      subtitle: 'زیرعنوان قبلی',
      petType: '507f1f77bcf86cd799439012',
    });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey });
    queryClient.clear();
  });

  it('refreshes only the matching main-text cache entry after an update', async () => {
    vi.mocked(updateArticleMainTextAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const queryKey = articlesQueryKeys.mainText(id);
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const mainText = { type: 'doc' as const, content: [] };

    const { result } = renderHook(() => useUpdateArticleMainTextMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ id, mainText });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey });
    queryClient.clear();
  });

  it('refreshes only the matching tags cache entry after replacement', async () => {
    vi.mocked(replaceArticleTagsAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const queryKey = articlesQueryKeys.tags(id);
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useReplaceArticleTagsMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ id, tags: [{ title: 'سگ' }] });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey });
    queryClient.clear();
  });

  it('uploads embedded images before creating an article and persists them after success', async () => {
    const mainText = {
      type: 'doc' as const,
      content: [{ type: 'image', attrs: { src: 'https://cdn.example.test/article.webp' } }],
    };
    const onCreated = vi.fn();
    vi.mocked(uploadRichTextImages).mockResolvedValue(mainText);
    vi.mocked(createArticleAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateArticle(onCreated), { wrapper });

    await act(async () => {
      await result.current.handleSubmit(createInput);
    });

    expect(uploadRichTextImages).toHaveBeenCalledWith(createInput.mainText);
    expect(createArticleAction).toHaveBeenCalledWith({ ...createInput, mainText });
    expect(persistRichTextDraftImages).toHaveBeenCalledWith(mainText);
    expect(onCreated).toHaveBeenCalledOnce();
    queryClient.clear();
  });

  it('uploads embedded images before updating article main text and persists them after success', async () => {
    const mainText = {
      type: 'doc' as const,
      content: [{ type: 'image', attrs: { src: 'https://cdn.example.test/article.webp' } }],
    };
    const onUpdated = vi.fn();
    vi.mocked(uploadRichTextImages).mockResolvedValue(mainText);
    vi.mocked(updateArticleMainTextAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateArticleMainText(id, onUpdated), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({ mainText: createInput.mainText });
    });

    expect(uploadRichTextImages).toHaveBeenCalledWith(createInput.mainText);
    expect(updateArticleMainTextAction).toHaveBeenCalledWith({ id, mainText });
    expect(persistRichTextDraftImages).toHaveBeenCalledWith(mainText);
    expect(onUpdated).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});

describe('article main-info query', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the entity client service, keys by ID, and projects only the editor fields', async () => {
    vi.mocked(articlesClientService.getById).mockResolvedValue({
      id,
      title: 'راهنمای مراقبت از سگ',
      subtitle: 'آنچه برای شروع باید بدانید',
      mainImage: 'https://cdn.example.test/articles/dog.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      petType: null,
      internalOnly: 'do not expose to the editor',
    } as never);
    const { queryClient, wrapper } = createSuspenseWrapper();
    const { result } = renderHook(() => useArticleMainInfoQuery(), { wrapper });

    await waitFor(() => expect(result.current.data).toBeInstanceOf(ArticleDetailsDTO));

    expect(result.current.data).toMatchObject({ id, title: 'راهنمای مراقبت از سگ' });
    expect(result.current.data).not.toHaveProperty('internalOnly');
    expect(articlesClientService.getById).toHaveBeenCalledWith(id, expect.any(AbortSignal));
    expect(queryClient.getQueryData(['articles', 'main-info', id])).toMatchObject({
      id,
      internalOnly: 'do not expose to the editor',
    });
    queryClient.clear();
  });
});

describe('article main-text query', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the entity client service, keys by ID, and projects only the editor field', async () => {
    const mainText = { type: 'doc' as const, content: [] };
    vi.mocked(articlesClientService.getMainTextById).mockResolvedValue({
      mainText,
      internalOnly: 'do not expose to the editor',
    } as never);
    const { queryClient, wrapper } = createMainTextSuspenseWrapper();
    const { result } = renderHook(() => useArticleMainTextQuery(), { wrapper });

    await waitFor(() => expect(result.current.data).toBeInstanceOf(ArticleMainTextDTO));

    expect(result.current.data).toMatchObject({ mainText });
    expect(result.current.data).not.toHaveProperty('internalOnly');
    expect(articlesClientService.getMainTextById).toHaveBeenCalledWith(id, expect.any(AbortSignal));
    expect(queryClient.getQueryData(articlesQueryKeys.mainText(id))).toMatchObject({
      mainText,
      internalOnly: 'do not expose to the editor',
    });
    queryClient.clear();
  });
});

describe('article tags query', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the entity client service, keys by ID, and projects tag fields', async () => {
    const tags = [{ title: 'سگ', internalOnly: 'do not expose to the editor' }];
    vi.mocked(articlesClientService.getTagsById).mockResolvedValue(tags as never);
    const { queryClient, wrapper: QueryProvider } = createWrapper();
    const { result } = renderHook(() => useArticleTagsQuery(), {
      wrapper: ({ children }) =>
        createElement(
          QueryProvider,
          null,
          createElement(
            UpdateTagsDialogContext,
            { value: { id } },
            createElement(Suspense, { fallback: null }, children),
          ),
        ),
    });

    await waitFor(() => expect(result.current.data[0]).toBeInstanceOf(ArticleTagDTO));

    expect(result.current.data).toMatchObject([{ title: 'سگ' }]);
    expect(result.current.data[0]).not.toHaveProperty('internalOnly');
    expect(articlesClientService.getTagsById).toHaveBeenCalledWith(id, expect.any(AbortSignal));
    expect(queryClient.getQueryData(articlesQueryKeys.tags(id))).toEqual(tags);
    queryClient.clear();
  });
});

describe('article catalogue infinite query', () => {
  beforeEach(() => vi.clearAllMocks());

  it('seeds the server page and loads following pages through the internal API service', async () => {
    vi.mocked(articlesClientService.getPaginated).mockImplementation((request) =>
      Promise.resolve(
        request.page === 2
          ? {
              ...initialCatalogPage,
              pagination: {
                ...initialCatalogPage.pagination,
                currentPage: 2,
                hasNextPage: false,
                nextPage: null,
              },
            }
          : initialCatalogPage,
      ),
    );
    const { queryClient, wrapper: QueryProvider } = createWrapper();
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryProvider, null, createElement(Suspense, { fallback: null }, children));
    const query = { tags: 'سگ,گربه', petType: '507f1f77bcf86cd799439011', sort: 'newest' };
    const { result } = renderHook(
      () => useSuspenseArticleCatalogInfiniteQuery(initialCatalogPage, query),
      { wrapper },
    );

    expect(articlesClientService.getPaginated).not.toHaveBeenCalled();
    expect(result.current.data.pages).toEqual([initialCatalogPage]);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(articlesClientService.getPaginated).toHaveBeenLastCalledWith(
      {
        tags: ['سگ', 'گربه'],
        petType: '507f1f77bcf86cd799439011',
        sort: 'newest',
        page: 2,
        limit: 10,
      },
      expect.any(AbortSignal),
    );
    queryClient.clear();
  });
});
