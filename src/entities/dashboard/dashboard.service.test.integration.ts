import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { getDashboardMetrics } from './dashboard.service';

const { cacheLifeMock, registerListMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);

describe('dashboard service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the authenticated dashboard metrics endpoint with validated defaults', async () => {
    const response = { isSuccess: true as const, message: null, data: {} as never };
    customFetcherMock.mockResolvedValue(response);

    await expect(getDashboardMetrics()).resolves.toBe(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/dashboard/metrics',
      method: 'GET',
      query: {
        groupBy: 'day',
        lowStockThreshold: 5,
        topLimit: 5,
        lowStockLimit: 5,
        recentLimit: 5,
      },
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 60 });
    expect(registerListMock).toHaveBeenCalledWith(
      'groupBy=day&lowStockLimit=5&lowStockThreshold=5&recentLimit=5&topLimit=5',
    );
  });
});
