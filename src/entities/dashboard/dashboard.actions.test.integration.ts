import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { getDashboardMetricsAction } from './dashboard.actions';
import { getDashboardMetrics } from './dashboard.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./dashboard.service', () => ({ getDashboardMetrics: vi.fn() }));

const getSessionMock = vi.mocked(getSession);
const getDashboardMetricsMock = vi.mocked(getDashboardMetrics);

function session(role: AuthSessionModel['role']): AuthSessionModel {
  return {
    accessExp: 1,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    role,
    sessionExp: 2,
    userId: 'user-1',
  };
}

describe('getDashboardMetricsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('authorizes admins and passes normalized query values to the service', async () => {
    const response = { isSuccess: true as const, message: null, data: {} as never };
    getDashboardMetricsMock.mockResolvedValue(response);

    await expect(
      getDashboardMetricsAction({ groupBy: 'month', lowStockThreshold: 0, ignored: true }),
    ).resolves.toBe(response);

    expect(getDashboardMetricsMock).toHaveBeenCalledWith({
      groupBy: 'month',
      lowStockThreshold: 0,
      topLimit: 5,
      lowStockLimit: 5,
      recentLimit: 5,
    });
  });

  it('rejects non-admin users before calling the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.SELLER));

    await expect(getDashboardMetricsAction()).resolves.toMatchObject({ isSuccess: false });

    expect(getDashboardMetricsMock).not.toHaveBeenCalled();
  });

  it('rejects invalid date ranges before calling the service', async () => {
    await expect(
      getDashboardMetricsAction({
        fromDate: '2026-09-05T00:00:00.000Z',
        toDate: '2026-09-01T00:00:00.000Z',
      }),
    ).resolves.toMatchObject({ isSuccess: false });

    expect(getDashboardMetricsMock).not.toHaveBeenCalled();
  });
});
