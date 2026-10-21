import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  createPetTypeAction,
  deletePetTypeAction,
  disablePetTypeAction,
} from './pet-types.actions';
import {
  useCreatePetTypeMutation,
  useDeletePetTypeMutation,
  usePetTypeStatusMutation,
} from './pet-types.client';

vi.mock('./pet-types.actions', () => ({
  createPetTypeAction: vi.fn(),
  deletePetTypeAction: vi.fn(),
  disablePetTypeAction: vi.fn(),
  enablePetTypeAction: vi.fn(),
  rangePetTypePropertyDefinitionsAction: vi.fn(),
  updatePetTypeAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439010';
const input = {
  title: 'Dog',
  description: { type: 'doc' as const, content: [] },
  mainImage: new File(['pet type'], 'dog.webp', { type: 'image/webp' }),
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

describe('pet type client mutations', () => {
  afterEach(() => vi.clearAllMocks());
  beforeEach(() => vi.clearAllMocks());

  it('delegates create, status, and delete mutations to Server Actions', async () => {
    vi.mocked(createPetTypeAction).mockResolvedValue(success);
    vi.mocked(disablePetTypeAction).mockResolvedValue(success);
    vi.mocked(deletePetTypeAction).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result: create } = renderHook(() => useCreatePetTypeMutation(), { wrapper });
    const { result: status } = renderHook(() => usePetTypeStatusMutation(), { wrapper });
    const { result: remove } = renderHook(() => useDeletePetTypeMutation(), { wrapper });

    await act(async () => {
      await create.current.mutateAsync(input);
      await status.current.mutateAsync({ id, enabled: false });
      await remove.current.mutateAsync({ id });
    });

    expect(createPetTypeAction).toHaveBeenCalledWith(input);
    expect(disablePetTypeAction).toHaveBeenCalledWith({ id });
    expect(deletePetTypeAction).toHaveBeenCalledWith({ id });
    await waitFor(() => expect(remove.current.isSuccess).toBe(true));
    queryClient.clear();
  });

  it('reports failed outcomes once without retrying', async () => {
    vi.mocked(deletePetTypeAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useDeletePetTypeMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    });

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(deletePetTypeAction).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
