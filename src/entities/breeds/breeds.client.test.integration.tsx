import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  createBreedAction,
  deleteBreedAction,
  disableBreedAction,
  enableBreedAction,
  replaceBreedPropertyDefinitionsAction,
  updateBreedAction,
} from './breeds.actions';
import {
  useBreedStatusMutation,
  useCreateBreedMutation,
  useDeleteBreedMutation,
  useReplaceBreedPropertyDefinitionsMutation,
  useUpdateBreedMutation,
} from './breeds.client';

vi.mock('./breeds.actions', () => ({
  createBreedAction: vi.fn(),
  deleteBreedAction: vi.fn(),
  disableBreedAction: vi.fn(),
  enableBreedAction: vi.fn(),
  replaceBreedPropertyDefinitionsAction: vi.fn(),
  updateBreedAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const id = '507f1f77bcf86cd799439011';
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

describe('breed client mutations', () => {
  afterEach(cleanup);
  beforeEach(() => vi.clearAllMocks());

  it.each([
    [
      'creates a breed',
      useCreateBreedMutation,
      createBreedAction,
      { title: 'گلدن' },
      { title: 'گلدن' },
    ],
    [
      'updates a breed',
      useUpdateBreedMutation,
      updateBreedAction,
      { id, title: 'گلدن' },
      { id, title: 'گلدن' },
    ],
    [
      'replaces property definitions',
      useReplaceBreedPropertyDefinitionsMutation,
      replaceBreedPropertyDefinitionsAction,
      { id, propertyDefinitions: [{ label: 'رنگ', value: 'طلایی' }] },
      { id, propertyDefinitions: [{ label: 'رنگ', value: 'طلایی' }] },
    ],
    ['enables a breed', useBreedStatusMutation, enableBreedAction, { id, enabled: true }, { id }],
    [
      'disables a breed',
      useBreedStatusMutation,
      disableBreedAction,
      { id, enabled: false },
      { id },
    ],
    ['deletes a breed', useDeleteBreedMutation, deleteBreedAction, { id }, { id }],
  ] as const)(
    '%s through a non-retrying Server Action mutation',
    async (_label, useHook, action, input, actionInput) => {
      vi.mocked(action).mockResolvedValue(success);
      const { queryClient, wrapper } = createWrapper();
      const { result } = renderHook(() => useHook(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(input as never);
      });

      expect(action).toHaveBeenCalledWith(actionInput);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      queryClient.clear();
    },
  );

  it('reports a failed action outcome once and does not retry it', async () => {
    vi.mocked(deleteBreedAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteBreedMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ id })).rejects.toBe(failure);
    });

    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(deleteBreedAction).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
