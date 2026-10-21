import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  createProductAction,
  deleteProductAction,
  disableProductAction,
  updateProductUserRateAction,
} from './products.actions';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductStatusMutation,
  useUpdateProductUserRate,
} from './products.client';

vi.mock('./products.actions', () => ({
  createProductAction: vi.fn(),
  deleteProductAction: vi.fn(),
  disableProductAction: vi.fn(),
  enableProductAction: vi.fn(),
  replaceProductWeightsAction: vi.fn(),
  updateProductBaseInfoAction: vi.fn(),
  updateProductImagesAction: vi.fn(),
  updateProductUserRateAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439010';
const input = {
  title: 'Dog food',
  description: { type: 'doc' as const, content: [] },
  category: '507f1f77bcf86cd799439012',
  brand: '507f1f77bcf86cd799439011',
  images: {
    images: [new File(['product'], 'food.webp', { type: 'image/webp' })],
    mainImageIndex: 0,
  },
};
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

describe('product client mutations', () => {
  afterEach(() => vi.clearAllMocks());
  beforeEach(() => vi.clearAllMocks());

  it('delegates create, status, delete, and rating mutations to Server Actions', async () => {
    vi.mocked(createProductAction).mockResolvedValue(success);
    vi.mocked(disableProductAction).mockResolvedValue(success);
    vi.mocked(deleteProductAction).mockResolvedValue(success);
    vi.mocked(updateProductUserRateAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result: create } = renderHook(() => useCreateProductMutation(), { wrapper });
    const { result: status } = renderHook(() => useProductStatusMutation(), { wrapper });
    const { result: remove } = renderHook(() => useDeleteProductMutation(), { wrapper });
    const { result: rate } = renderHook(() => useUpdateProductUserRate(id), { wrapper });

    await act(async () => {
      await create.current.mutateAsync(input);
      await status.current.mutateAsync({ id, enabled: false });
      await remove.current.mutateAsync({ id });
      await rate.current.mutateAsync({ id, userRate: 5 });
    });

    expect(createProductAction).toHaveBeenCalledWith(input);
    expect(disableProductAction).toHaveBeenCalledWith({ id });
    expect(deleteProductAction).toHaveBeenCalledWith({ id });
    expect(updateProductUserRateAction).toHaveBeenCalledWith({ id, userRate: 5 });
    await waitFor(() => expect(rate.current.isSuccess).toBe(true));
    queryClient.clear();
  });

  it('reports a failed action result once and does not retry it', async () => {
    vi.mocked(deleteProductAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteProductMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    });

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(deleteProductAction).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
