import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createProfileAddress,
  getProfileAccount,
  getProfileOrders,
  resetProfilePassword,
  updateProfileAddress,
} from './profile.service';

const {
  invalidateAllMock,
  invalidateDetailMock,
  invalidateListMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  invalidateAllMock: vi.fn(),
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = vi.fn();
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
    this.invalidateAll = invalidateAllMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
  }),
}));

const fetcher = vi.mocked(customFetcher);

describe('profile service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reads the authenticated profile account with private transport semantics', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);

    await getProfileAccount('user-1');

    expect(fetcher).toHaveBeenCalledWith({
      url: '/profile/account',
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith('user-1');
  });

  it('normalizes profile order query defaults and registers a user-scoped list key', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);

    await getProfileOrders('user-1');

    expect(fetcher).toHaveBeenCalledWith({
      url: '/profile/orders',
      method: 'GET',
      query: { page: 1, limit: 10, sort: 'createdAt' },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith('orders:user-1:limit=10&page=1&sort=createdAt');
  });

  it('invalidates profile data only after successful mutations', async () => {
    fetcher
      .mockResolvedValueOnce({ isSuccess: true, message: 'created', data: {} } as never)
      .mockResolvedValueOnce({
        isSuccess: false,
        message: 'failed',
        data: { messages: {}, details: {} },
      });

    await createProfileAddress({
      province: 'تهران',
      city: 'تهران',
      detailAddress: 'خیابان آزادی پلاک دوازده',
      plate: '۱۲',
      postalCode: '1234567890',
      receiverIsMe: true,
      phoneNumber: '09121234567',
    });
    await updateProfileAddress('user-1', '507f1f77bcf86cd799439011', { plate: '۲۵' });

    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });

  it('invalidates all profile data only after a successful password reset', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: 'updated', data: undefined } as never);

    await resetProfilePassword({
      oldPassword: 'old-password',
      password: 'new-password',
      repeatPassword: 'new-password',
    });

    expect(invalidateAllMock).toHaveBeenCalledOnce();
  });
});
