import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import { createOrder, getUserOrders, updateOrderDeliveryState } from './orders.service';

const {
  invalidateDetailMock,
  invalidateListMock,
  invalidateProfileOrderDataMock,
  registerListMock,
} = vi.hoisted(() => ({
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  invalidateProfileOrderDataMock: vi.fn(),
  registerListMock: vi.fn(),
}));
vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/entities/profile/profile.service', () => ({
  invalidateProfileOrderData: invalidateProfileOrderDataMock,
}));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = vi.fn();
    this.registerList = registerListMock;
    this.registerDetail = vi.fn();
    this.invalidateList = invalidateListMock;
    this.invalidateDetail = invalidateDetailMock;
  }),
}));
const fetcher = vi.mocked(customFetcher);

describe('orders service', () => {
  beforeEach(() => vi.clearAllMocks());
  it('uses the authenticated user-orders endpoint and normalized query defaults', async () => {
    fetcher.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { result: [], pagination: {} },
    } as never);
    await getUserOrders();
    expect(fetcher).toHaveBeenCalledWith({
      url: '/orders',
      query: { page: 1, limit: 10, sort: 'createdAt' },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith('/orders:limit=10&page=1&sort=createdAt');
  });
  it('invalidates the orders list only after a successful checkout', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: 'created', data: {} } as never);
    await createOrder({ paymentTrackingId: 'payment-1' }, 'user-1');
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateProfileOrderDataMock).toHaveBeenCalledWith('user-1');
  });
  it('invalidates the changed detail and list after a successful delivery update', async () => {
    fetcher.mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: { user: 'user-1' },
    } as never);
    await updateOrderDeliveryState({ id: '507f1f77bcf86cd799439011', deliveryState: 2 });
    expect(fetcher).toHaveBeenCalledWith({
      url: '/orders/507f1f77bcf86cd799439011/delivery-state',
      method: 'PATCH',
      body: { deliveryState: 2 },
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateProfileOrderDataMock).toHaveBeenCalledWith(
      'user-1',
      '507f1f77bcf86cd799439011',
    );
  });
});
