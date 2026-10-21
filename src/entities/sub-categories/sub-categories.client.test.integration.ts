import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  updateSubCategoryAction,
} from './sub-categories.actions';
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from './sub-categories.client';

vi.mock('./sub-categories.actions', () => ({
  createSubCategoryAction: vi.fn(),
  deleteSubCategoryAction: vi.fn(),
  updateSubCategoryAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = { title: 'غذای خشک', category: '507f1f77bcf86cd799439011' };
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [], details: {} },
};
function wrapper() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return {
    client,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client }, children),
  };
}

describe('sub-category client mutations', () => {
  beforeEach(() => vi.clearAllMocks());
  it.each([
    [useCreateSubCategoryMutation, createSubCategoryAction, input],
    [useUpdateSubCategoryMutation, updateSubCategoryAction, { id, ...input }],
    [useDeleteSubCategoryMutation, deleteSubCategoryAction, { id }],
  ] as const)(
    'delegates successful mutations through the Server Action',
    async (useHook, action, variables) => {
      vi.mocked(action).mockResolvedValue({
        isSuccess: true,
        message: 'انجام شد.',
        data: {} as never,
      });
      const setup = wrapper();
      const { result } = renderHook(() => useHook(), { wrapper: setup.wrapper });
      await result.current.mutateAsync(variables as never);
      expect(action).toHaveBeenCalledWith(variables);
      expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'انجام شد.' });
      setup.client.clear();
    },
  );
  it('reports a failed result once without retrying', async () => {
    vi.mocked(deleteSubCategoryAction).mockResolvedValue(failure);
    const setup = wrapper();
    const { result } = renderHook(() => useDeleteSubCategoryMutation(), { wrapper: setup.wrapper });
    await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    expect(deleteSubCategoryAction).toHaveBeenCalledOnce();
    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    setup.client.clear();
  });

  it('keeps the backend success toast when an entity adds post-success work', async () => {
    vi.mocked(createSubCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'ایجاد شد.',
      data: {} as never,
    });
    const onSuccess = vi.fn();
    const setup = wrapper();
    const { result } = renderHook(() => useCreateSubCategoryMutation({ onSuccess }), {
      wrapper: setup.wrapper,
    });

    await result.current.mutateAsync(input);

    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'ایجاد شد.' });
    expect(onSuccess).toHaveBeenCalledOnce();
    setup.client.clear();
  });

  it('allows form orchestration to receive the complete normalized error', async () => {
    vi.mocked(updateSubCategoryAction).mockResolvedValue(failure);
    const onError = vi.fn();
    const setup = wrapper();
    const { result } = renderHook(() => useUpdateSubCategoryMutation({ onError }), {
      wrapper: setup.wrapper,
    });

    await expect(result.current.mutateAsync({ id, ...input })).rejects.toBe(failure);

    expect(onError).toHaveBeenCalledWith(failure, { id, ...input }, undefined, expect.anything());
    expect(globalErrorHandler).not.toHaveBeenCalled();
    setup.client.clear();
  });
});
