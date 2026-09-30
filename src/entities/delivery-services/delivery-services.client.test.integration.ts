import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  submitCreateDeliveryService,
  submitDeleteDeliveryService,
  submitDeliveryServiceEnabledUpdate,
  submitUpdateDeliveryService,
  getAvailableDeliveryServices,
  useAvailableDeliveryServices,
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

describe('delivery service client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits creation and updates, then presents backend success messages', async () => {
    vi.mocked(createDeliveryServiceAction).mockResolvedValue({
      isSuccess: true,
      message: 'ایجاد شد.',
      data: {} as never,
    });
    vi.mocked(updateDeliveryServiceAction).mockResolvedValue({
      isSuccess: true,
      message: 'ویرایش شد.',
      data: {} as never,
    });
    await expect(submitCreateDeliveryService(input, vi.fn())).resolves.toBe(true);
    await expect(submitUpdateDeliveryService(id, input, vi.fn())).resolves.toBe(true);
    expect(createDeliveryServiceAction).toHaveBeenCalledWith(input);
    expect(updateDeliveryServiceAction).toHaveBeenCalledWith({ id, ...input });
    expect(toast.add).toHaveBeenNthCalledWith(1, { type: 'success', title: 'ایجاد شد.' });
    expect(toast.add).toHaveBeenNthCalledWith(2, { type: 'success', title: 'ویرایش شد.' });
  });

  it('reads public delivery quotes through the delivery-service Server Action', async () => {
    const result = { isSuccess: true as const, message: null, data: [] };
    vi.mocked(getAvailableDeliveryServicesAction).mockResolvedValue(result);

    await expect(getAvailableDeliveryServices({ lat: 35.72, lng: 51.33 })).resolves.toBe(result);
    expect(getAvailableDeliveryServicesAction).toHaveBeenCalledWith({ lat: 35.72, lng: 51.33 });
  });

  it('uses an ephemeral TanStack Query for available-delivery reads', async () => {
    vi.mocked(getAvailableDeliveryServicesAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [],
    });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useAvailableDeliveryServices({ lat: 35.72, lng: 51.33 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAvailableDeliveryServicesAction).toHaveBeenCalledWith({ lat: 35.72, lng: 51.33 });
    expect(queryClient.getQueryCache().findAll()).toHaveLength(1);
    queryClient.clear();
  });

  it.each([
    [true, enableDeliveryServiceAction],
    [false, disableDeliveryServiceAction],
  ] as const)('selects the matching status action', async (enabled, action) => {
    vi.mocked(action).mockResolvedValue({
      isSuccess: true,
      message: 'وضعیت تغییر کرد.',
      data: {} as never,
    });
    await expect(submitDeliveryServiceEnabledUpdate(id, enabled)).resolves.toBe(true);
    expect(action).toHaveBeenCalledWith({ id });
  });

  it('forwards form and destructive failures to the shared error handler', async () => {
    vi.mocked(createDeliveryServiceAction).mockResolvedValue(failure);
    vi.mocked(deleteDeliveryServiceAction).mockResolvedValue(failure);
    const setError = vi.fn();
    await expect(submitCreateDeliveryService(input, setError)).resolves.toBe(false);
    await expect(submitDeleteDeliveryService(id)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, failure);
    expect(toast.add).not.toHaveBeenCalled();
  });
});
