import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  updateCategoryAction,
} from './categories.actions';
import {
  useCategoryStatusMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from './categories.client';

vi.mock('./categories.actions', () => ({
  createCategoryAction: vi.fn(),
  deleteCategoryAction: vi.fn(),
  disableCategoryAction: vi.fn(),
  enableCategoryAction: vi.fn(),
  updateCategoryAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = {
  title: 'غذای خشک',
  petType: '507f1f77bcf86cd799439011',
  mainImage: new File(['image'], 'category.webp', { type: 'image/webp' }),
  isEnable: true,
};
const updateInput = { ...input };
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [], details: {} },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

afterEach(() => vi.clearAllMocks());

describe('category client mutations', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ['create', useCreateCategoryMutation, createCategoryAction, input, input],
    [
      'update',
      useUpdateCategoryMutation,
      updateCategoryAction,
      { id, ...updateInput },
      { id, ...updateInput },
    ],
    ['enable', useCategoryStatusMutation, enableCategoryAction, { id, enabled: true }, { id }],
    ['disable', useCategoryStatusMutation, disableCategoryAction, { id, enabled: false }, { id }],
    ['delete', useDeleteCategoryMutation, deleteCategoryAction, { id }, { id }],
  ] as const)(
    '%s delegates to its Server Action and shows its backend message',
    async (_, useHook, action, variables, expectedInput) => {
      vi.mocked(action).mockResolvedValue({
        isSuccess: true,
        message: 'انجام شد.',
        data: {} as never,
      });
      const { queryClient, wrapper } = createWrapper();
      const { result } = renderHook(() => useHook(), { wrapper });

      await result.current.mutateAsync(variables as never);

      expect(action).toHaveBeenCalledWith(expectedInput);
      expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'انجام شد.' });
      queryClient.clear();
    },
  );

  it('reports a normalized failure once and does not retry it', async () => {
    vi.mocked(createCategoryAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateCategoryMutation(), { wrapper });

    await expect(result.current.mutateAsync(input)).rejects.toBe(failure);

    expect(createCategoryAction).toHaveBeenCalledTimes(1);
    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(toast.add).not.toHaveBeenCalled();
    queryClient.clear();
  });
});
