import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  createBrandAction,
  deleteBrandAction,
  disableBrandAction,
  enableBrandAction,
  updateBrandAction,
} from './brands.actions';
import {
  useBrandStatusMutation,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from './brands.client';

vi.mock('./brands.actions', () => ({
  createBrandAction: vi.fn(),
  deleteBrandAction: vi.fn(),
  disableBrandAction: vi.fn(),
  enableBrandAction: vi.fn(),
  updateBrandAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const success = { isSuccess: true as const, message: 'انجام شد', data: {} as never };
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: {}, details: {} },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, wrapper };
}

describe('brand client mutations', () => {
  afterEach(cleanup);
  beforeEach(() => vi.clearAllMocks());

  it.each([
    [
      'creates a brand',
      useCreateBrandMutation,
      createBrandAction,
      { title: 'Royal Canin' },
      undefined,
    ],
    [
      'updates a brand',
      useUpdateBrandMutation,
      updateBrandAction,
      { id, title: 'Royal Canin' },
      undefined,
    ],
    ['enables a brand', useBrandStatusMutation, enableBrandAction, { id, enabled: true }, { id }],
    [
      'disables a brand',
      useBrandStatusMutation,
      disableBrandAction,
      { id, enabled: false },
      { id },
    ],
    ['deletes a brand', useDeleteBrandMutation, deleteBrandAction, { id }, undefined],
  ] as const)(
    '%s through a non-retrying Server Action mutation',
    async (_label, useHook, action, input, actionInput) => {
      vi.mocked(action).mockResolvedValue(success);
      const { queryClient, wrapper } = createWrapper();
      const { result } = renderHook(() => useHook(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(input as never);
      });

      expect(action).toHaveBeenCalledWith((actionInput ?? input) as never);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      queryClient.clear();
    },
  );

  it('reports a failed action outcome once and does not retry it', async () => {
    vi.mocked(deleteBrandAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteBrandMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    });

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(deleteBrandAction).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
