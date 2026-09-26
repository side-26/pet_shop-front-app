import { beforeEach, describe, expect, it, vi } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { deleteSessionCookie, getSession } from '@/utils/session';

import {
  getProfileAccountAction,
  getProfileOrderAction,
  getProfileOrderSummaryAction,
  resetProfilePasswordAction,
  retryProfileOrderSummaryAction,
} from './profile.actions';
import * as service from './profile.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('@/utils/session', () => ({
  getSession: vi.fn(),
  deleteSessionCookie: vi.fn(),
}));
vi.mock('./profile.service', () => ({
  getProfileAccount: vi.fn(),
  getProfileAddress: vi.fn(),
  createProfileAddress: vi.fn(),
  deleteProfileAddress: vi.fn(),
  deleteProfileAvatar: vi.fn(),
  getProfileAddresses: vi.fn(),
  getProfileOrder: vi.fn(),
  getProfileOrderSummary: vi.fn(),
  getProfileOrders: vi.fn(),
  invalidateProfileOrderData: vi.fn(),
  resetProfilePassword: vi.fn(),
  updateProfileAddress: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const deleteSessionCookieMock = vi.mocked(deleteSessionCookie);
const getProfileAccountMock = vi.mocked(service.getProfileAccount);
const getProfileOrderMock = vi.mocked(service.getProfileOrder);
const getProfileOrderSummaryMock = vi.mocked(service.getProfileOrderSummary);
const invalidateProfileOrderDataMock = vi.mocked(service.invalidateProfileOrderData);
const resetProfilePasswordMock = vi.mocked(service.resetProfilePassword);

const customerSession = {
  userId: 'user-1',
  role: USER_ROLES.CUSTOMER,
} as Awaited<ReturnType<typeof getSession>>;

describe('profile actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(customerSession);
  });

  it('rejects unauthenticated and non-customer profile access', async () => {
    getSessionMock.mockResolvedValueOnce(null).mockResolvedValueOnce({
      ...customerSession!,
      role: USER_ROLES.ADMIN,
    });

    await expect(getProfileAccountAction()).resolves.toMatchObject({ isSuccess: false });
    await expect(getProfileAccountAction()).resolves.toMatchObject({ isSuccess: false });
    expect(getProfileAccountMock).not.toHaveBeenCalled();
  });

  it('validates an owned order ID before calling the profile service', async () => {
    getProfileOrderMock.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);

    await expect(getProfileOrderAction({ id: 'invalid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    await getProfileOrderAction({ id: '507f1f77bcf86cd799439011' });

    expect(getProfileOrderMock).toHaveBeenCalledOnce();
    expect(getProfileOrderMock).toHaveBeenCalledWith('user-1', '507f1f77bcf86cd799439011');
  });

  it('reads the authenticated customer order summary', async () => {
    getProfileOrderSummaryMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {},
    } as never);

    await getProfileOrderSummaryAction();

    expect(getProfileOrderSummaryMock).toHaveBeenCalledWith('user-1');
  });

  it('invalidates only the authenticated user order data before refreshing its summary section', async () => {
    await retryProfileOrderSummaryAction();

    expect(invalidateProfileOrderDataMock).toHaveBeenCalledWith('user-1');
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('deletes the local session only after a successful password reset', async () => {
    const input = {
      oldPassword: 'old-password',
      password: 'new-password',
      repeatPassword: 'new-password',
    };
    resetProfilePasswordMock
      .mockResolvedValueOnce({ isSuccess: true, message: 'updated', data: undefined } as never)
      .mockResolvedValueOnce({
        isSuccess: false,
        message: 'failed',
        data: { messages: {}, details: {} },
      });

    await resetProfilePasswordAction(input);
    await resetProfilePasswordAction(input);

    expect(resetProfilePasswordMock).toHaveBeenCalledTimes(2);
    expect(deleteSessionCookieMock).toHaveBeenCalledOnce();
  });
});
