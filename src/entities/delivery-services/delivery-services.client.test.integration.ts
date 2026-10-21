import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createDeliveryServiceAction,
  deleteDeliveryServiceAction,
  disableDeliveryServiceAction,
  enableDeliveryServiceAction,
  getAvailableDeliveryServicesAction,
  updateDeliveryServiceAction,
} from './delivery-services.actions';
import {
  deliveryServicesQueryKeys,
  getAvailableDeliveryServices,
  useAvailableDeliveryServices,
  useCreateDeliveryServiceMutation,
  useDeleteDeliveryServiceMutation,
  useDeliveryServiceStatusMutation,
  useUpdateDeliveryServiceMutation,
} from './delivery-services.client';

vi.mock('./delivery-services.actions', () => ({
  createDeliveryServiceAction: vi.fn(),
  deleteDeliveryServiceAction: vi.fn(),
  disableDeliveryServiceAction: vi.fn(),
  enableDeliveryServiceAction: vi.fn(),
  getAvailableDeliveryServicesAction: vi.fn(),
  updateDeliveryServiceAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = {
  title: 'Courier',
  title_fa: 'پیک',
  logo: 'https://cdn.example.test/courier.webp',
  originCoordinates: [51.389, 35.689] as [number, number],
  availability: {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  },
  basePrice: 0,
  packingPrice: 0,
  cityLeadDays: 0,
  outsideCityLeadDays: 1,
  pricePerKilometerInCity: 1000,
  pricePerKilometer: 2000,
  isEnable: true,
};
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [], details: {} },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

afterEach(() => vi.clearAllMocks());

describe('delivery service client data flow', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reads public delivery quotes through the delivery-service Server Action', async () => {
    const response = { isSuccess: true as const, message: null, data: [] };
    vi.mocked(getAvailableDeliveryServicesAction).mockResolvedValue(response);

    await expect(getAvailableDeliveryServices({ lat: 35.72, lng: 51.33 })).resolves.toBe(response);
    expect(getAvailableDeliveryServicesAction).toHaveBeenCalledWith({ lat: 35.72, lng: 51.33 });
  });

  it('keeps available-delivery reads ephemeral in TanStack Query', async () => {
    vi.mocked(getAvailableDeliveryServicesAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [],
    });
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useAvailableDeliveryServices({ lat: 35.72, lng: 51.33 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryCache().findAll()).toHaveLength(1);
    queryClient.clear();
  });

  it.each([
    ['create', useCreateDeliveryServiceMutation, createDeliveryServiceAction, input, input],
    [
      'update',
      useUpdateDeliveryServiceMutation,
      updateDeliveryServiceAction,
      { id, ...input },
      { id, ...input },
    ],
    [
      'enable',
      useDeliveryServiceStatusMutation,
      enableDeliveryServiceAction,
      { id, enabled: true },
      { id },
    ],
    [
      'disable',
      useDeliveryServiceStatusMutation,
      disableDeliveryServiceAction,
      { id, enabled: false },
      { id },
    ],
    ['delete', useDeleteDeliveryServiceMutation, deleteDeliveryServiceAction, { id }, { id }],
  ] as const)(
    '%s invalidates client-owned quotes only after a successful response',
    async (_, useHook, action, variables, expectedInput) => {
      vi.mocked(action).mockResolvedValue({
        isSuccess: true,
        message: 'انجام شد.',
        data: {} as never,
      });
      const { queryClient, wrapper } = createWrapper();
      const quoteInput = { lat: 35.72, lng: 51.33 };
      queryClient.setQueryData(deliveryServicesQueryKeys.available(quoteInput), []);
      const { result } = renderHook(() => useHook(), { wrapper });

      await result.current.mutateAsync(variables as never);

      expect(action).toHaveBeenCalledWith(expectedInput);
      expect(
        queryClient.getQueryState(deliveryServicesQueryKeys.available(quoteInput))?.isInvalidated,
      ).toBe(true);
      expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'انجام شد.' });
      queryClient.clear();
    },
  );

  it('does not invalidate quotes or retry when the Server Action fails', async () => {
    vi.mocked(createDeliveryServiceAction).mockResolvedValue(failure);
    const { queryClient, wrapper } = createWrapper();
    const quoteInput = { lat: 35.72, lng: 51.33 };
    queryClient.setQueryData(deliveryServicesQueryKeys.available(quoteInput), []);
    const { result } = renderHook(() => useCreateDeliveryServiceMutation(), { wrapper });

    await expect(result.current.mutateAsync(input)).rejects.toBe(failure);

    expect(createDeliveryServiceAction).toHaveBeenCalledTimes(1);
    expect(
      queryClient.getQueryState(deliveryServicesQueryKeys.available(quoteInput))?.isInvalidated,
    ).toBe(false);
    expect(globalErrorHandler).toHaveBeenCalledWith(failure);
    expect(toast.add).not.toHaveBeenCalled();
    queryClient.clear();
  });
});
