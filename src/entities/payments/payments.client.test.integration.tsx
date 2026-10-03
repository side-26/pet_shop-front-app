import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { globalErrorHandler } from '@/utils/helpers';

import {
  cancelGatewayPaymentAction,
  createPaymentAction,
  payGatewayPaymentAction,
  requestPaymentAction,
  updatePaymentStatusAction,
} from './payments.actions';
import {
  useCancelGatewayPaymentMutation,
  useCreatePaymentMutation,
  usePayGatewayPaymentMutation,
  useRequestPaymentMutation,
  useUpdatePaymentStatusMutation,
} from './payments.client';

vi.mock('./payments.actions', () => ({
  cancelGatewayPaymentAction: vi.fn(),
  createPaymentAction: vi.fn(),
  payGatewayPaymentAction: vi.fn(),
  requestPaymentAction: vi.fn(),
  updatePaymentStatusAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439011';
const authority = 'a'.repeat(64);
const success = { isSuccess: true as const, message: 'ok', data: {} as never };
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [], details: {} },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, wrapper };
}

describe('payment client mutations', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    [
      'creates payments',
      useCreatePaymentMutation,
      createPaymentAction,
      {
        order: id,
        amount: 10,
        authority: 'authority',
        expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      },
    ],
    [
      'requests a checkout payment',
      useRequestPaymentMutation,
      requestPaymentAction,
      { orderId: id },
    ],
    [
      'updates payment status',
      useUpdatePaymentStatusMutation,
      updatePaymentStatusAction,
      {
        id,
        status: 'paid' as const,
      },
    ],
    [
      'pays through the gateway',
      usePayGatewayPaymentMutation,
      payGatewayPaymentAction,
      { authority },
    ],
    [
      'cancels through the gateway',
      useCancelGatewayPaymentMutation,
      cancelGatewayPaymentAction,
      {
        authority,
      },
    ],
  ] as const)('%s through its Server Action', async (_label, usePaymentHook, action, input) => {
    vi.mocked(action).mockResolvedValue(success);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => usePaymentHook(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(input as never);
    });

    expect(action).toHaveBeenCalledWith(...(input === undefined ? [] : [input]));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    queryClient.clear();
  });

  it('retries failed action outcomes and reports the final error once', async () => {
    vi.mocked(requestPaymentAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useRequestPaymentMutation(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ orderId: id })).rejects.toBe(failure);
    });
    await waitFor(() => expect(globalErrorHandler).toHaveBeenCalledWith(failure));

    expect(requestPaymentAction).toHaveBeenCalledTimes(3);
    expect(globalErrorHandler).toHaveBeenCalledOnce();
    queryClient.clear();
  });
});
