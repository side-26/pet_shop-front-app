import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createDeliveryService,
  deleteDeliveryService,
  disableDeliveryService,
  getAllDeliveryServices,
  getAvailableDeliveryServices,
  getDeliveryServiceById,
  updateDeliveryService,
} from './delivery-services.service';

const {
  cacheLifeMock,
  invalidateDetailMock,
  invalidateListMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
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
  pricePerKilometerInCity: 1000,
  pricePerKilometer: 2000,
  isEnable: true,
};
const deliveryService = {
  id,
  ...input,
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};

describe('delivery service service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses private authenticated cache scopes for management reads', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [deliveryService],
    });
    await getAllDeliveryServices({ includeDisabled: true });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/delivery-services',
      method: 'GET',
      query: { includeDisabled: true },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith('includeDisabled=true');
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });

    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: deliveryService });
    await getDeliveryServiceById(id);
    expect(customFetcherMock).toHaveBeenLastCalledWith({
      url: `/delivery-services/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('keeps the public, time-sensitive quote lookup uncached and unauthenticated', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });
    await getAvailableDeliveryServices({ lat: 35.689, lng: 51.389 });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/delivery-services/available',
      method: 'GET',
      query: { lat: 35.689, lng: 51.389 },
      auth: false,
      cache: 'no-store',
    });
    expect(registerListMock).not.toHaveBeenCalled();
  });

  it('sends exact create and update bodies then invalidates list/detail only after success', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'created',
      data: deliveryService,
    });
    await createDeliveryService(input);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/delivery-services',
      method: 'POST',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).not.toHaveBeenCalled();

    await updateDeliveryService(id, input);
    expect(customFetcherMock).toHaveBeenLastCalledWith({
      url: `/delivery-services/${id}`,
      method: 'PUT',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledTimes(2);
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('invalidates successful status/deletion mutations and leaves failed results cached', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'ok', data: deliveryService });
    await disableDeliveryService(id);
    await deleteDeliveryService(id);
    expect(invalidateListMock).toHaveBeenCalledTimes(2);
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);

    vi.clearAllMocks();
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });
    await disableDeliveryService(id);
    expect(invalidateListMock).not.toHaveBeenCalled();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });
});
