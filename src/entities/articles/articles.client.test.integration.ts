import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, Suspense, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import { UpdateMainInfoDialogContext } from '@/app/admin/articles/_components/update-main-info-dialog/context';

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
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useReplaceArticleTagsMutation,
  useUpdateArticleMainTextMutation,
  useUpdateArticleMutation,
} from './articles.client';
import { articlesClientService } from './articles.client-service';
import { ArticleDetailsDTO } from './articles.dto';

vi.mock('./articles.actions', () => ({
  createArticleAction: vi.fn(),
  deleteArticleAction: vi.fn(),
  updateArticleAction: vi.fn(),
  updateArticleMainTextAction: vi.fn(),
  replaceArticleTagsAction: vi.fn(),
}));
vi.mock('./articles.client-service', () => ({
  articlesClientService: { getById: vi.fn() },
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
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

describe('article client mutations', () => {
  beforeEach(() => vi.clearAllMocks());

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
