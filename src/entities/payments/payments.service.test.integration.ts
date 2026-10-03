import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  getGatewayPayment,
  getUserPayment,
  getUserPayments,
  payGatewayPayment,
  requestPayment,
  updatePaymentStatus,
} from './payments.service';

const {
  cacheLifeMock,
  invalidateAllMock,
  invalidateDetailMock,
  invalidateListMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateAllMock: vi.fn(),
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.invalidateAll = invalidateAllMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
  }),
}));

const fetcher = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439011';
const authority = 'a'.repeat(64);

describe('payments service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses authenticated private scopes for payment lists and details', async () => {
    fetcher.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { result: [], pagination: {} },
    } as never);
    await getUserPayments({ status: 'pending' });
    expect(fetcher).toHaveBeenCalledWith({
      url: '/payments',
      method: 'GET',
      query: { page: 1, limit: 10, sort: 'createdAt', status: 'pending' },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith(
      '/payments:limit=10&page=1&sort=createdAt&status=pending',
    );
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 120 });

    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);
    await getUserPayment(id);
    expect(fetcher).toHaveBeenLastCalledWith({
      url: `/payments/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('keeps public gateway data unauthenticated and uncached', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);
    await getGatewayPayment(authority);
    expect(fetcher).toHaveBeenCalledWith({
      url: `/gateway/payments/${authority}`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
    expect(registerListMock).not.toHaveBeenCalled();
  });

  it('sends exact mutation bodies and invalidates only successful related scopes', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: 'created', data: {} } as never);
    await requestPayment();
    expect(fetcher).toHaveBeenCalledWith({
      url: '/payments/request',
      method: 'POST',
      body: {},
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();

    fetcher.mockResolvedValue({ isSuccess: true, message: 'updated', data: {} } as never);
    await updatePaymentStatus({ id, status: 'paid', gatewayReferenceId: 'ref-1' });
    expect(fetcher).toHaveBeenLastCalledWith({
      url: `/payments/${id}/status`,
      method: 'PATCH',
      body: { status: 'paid', gatewayReferenceId: 'ref-1' },
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
    expect(invalidateListMock).toHaveBeenCalledTimes(2);

    fetcher.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    } as never);
    await updatePaymentStatus({ id, status: 'failed' });
    expect(invalidateDetailMock).toHaveBeenCalledOnce();
    expect(invalidateListMock).toHaveBeenCalledTimes(2);
  });

  it('invalidates all payment scopes only after a successful public gateway payment', async () => {
    fetcher.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { success: true, callbackUrl: '/order/result' },
    } as never);
    await payGatewayPayment(authority);
    expect(fetcher).toHaveBeenCalledWith({
      url: `/gateway/payments/${authority}/pay`,
      method: 'POST',
      body: undefined,
      auth: false,
      cache: 'no-store',
    });
    expect(invalidateAllMock).toHaveBeenCalledOnce();
  });
});
