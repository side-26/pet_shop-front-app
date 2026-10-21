import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  createPetAction,
  deletePetAction,
  disablePetAction,
  updatePetPriceAction,
} from './pets.actions';
import {
  useCreatePetMutation,
  useDeletePetMutation,
  usePetStatusMutation,
  useUpdatePetPriceMutation,
} from './pets.client';

vi.mock('./pets.actions', () => ({
  createPetAction: vi.fn(),
  deletePetAction: vi.fn(),
  disablePetAction: vi.fn(),
  enablePetAction: vi.fn(),
  updatePetBaseInfoAction: vi.fn(),
  updatePetImagesAction: vi.fn(),
  updatePetPriceAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439010';
const input = {
  title: 'Kitten',
  description: { type: 'doc' as const, content: [] },
  petType: '507f1f77bcf86cd799439011',
  breed: '507f1f77bcf86cd799439012',
  slug: 'kitten',
  images: {
    images: [new File(['pet'], 'pet.webp', { type: 'image/webp' })],
    mainImageIndex: 0,
  },
  quantity: 0,
  price: 0,
  discountPercentage: 0,
  inEnable: true,
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

describe('pet client mutations', () => {
  afterEach(() => vi.clearAllMocks());
  beforeEach(() => vi.clearAllMocks());

  it('delegates create, section update, status, and delete mutations to their Server Actions', async () => {
    vi.mocked(createPetAction).mockResolvedValue(success);
    vi.mocked(updatePetPriceAction).mockResolvedValue(success);
    vi.mocked(disablePetAction).mockResolvedValue(success);
    vi.mocked(deletePetAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result: create } = renderHook(() => useCreatePetMutation(), { wrapper });
    const { result: updatePrice } = renderHook(() => useUpdatePetPriceMutation(), { wrapper });
    const { result: status } = renderHook(() => usePetStatusMutation(), { wrapper });
    const { result: remove } = renderHook(() => useDeletePetMutation(), { wrapper });

    await act(async () => {
      await create.current.mutateAsync(input);
      await updatePrice.current.mutateAsync({ id, price: 200 });
      await status.current.mutateAsync({ id, enabled: false });
      await remove.current.mutateAsync({ id });
    });

    expect(createPetAction).toHaveBeenCalledWith(input);
    expect(updatePetPriceAction).toHaveBeenCalledWith({ id, price: 200 });
    expect(disablePetAction).toHaveBeenCalledWith({ id });
    expect(deletePetAction).toHaveBeenCalledWith({ id });
    await waitFor(() => expect(remove.current.isSuccess).toBe(true));
    queryClient.clear();
  });

  it('reports a failed action result once and does not retry it', async () => {
    vi.mocked(deletePetAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useDeletePetMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    });

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(deletePetAction).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
