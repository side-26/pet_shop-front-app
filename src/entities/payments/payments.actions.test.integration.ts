import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  getAllPaymentsAction,
  getGatewayPaymentAction,
  requestPaymentAction,
  updatePaymentStatusAction,
} from './payments.actions';
import * as service from './payments.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./payments.service', () => ({
  cancelGatewayPayment: vi.fn(),
  createPayment: vi.fn(),
  getAllPayments: vi.fn(),
  getGatewayPayment: vi.fn(),
  getUserPayment: vi.fn(),
  getUserPayments: vi.fn(),
  payGatewayPayment: vi.fn(),
  requestPayment: vi.fn(),
  updatePaymentStatus: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439011';
const session = (role: AuthSessionModel['role']): AuthSessionModel => ({
  accessExp: 1,
  accessToken: 'token',
  refreshToken: 'refresh',
  role,
  sessionExp: 2,
  userId: 'user-1',
});
const success = { isSuccess: true as const, message: 'ok', data: {} as never };

describe('payment actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
  });

  it('accepts no client checkout data because the backend owns the Cart snapshot', async () => {
    vi.mocked(service.requestPayment).mockResolvedValue(success);
    await expect(requestPaymentAction()).resolves.toBe(success);
    expect(service.requestPayment).toHaveBeenCalledWith();

    await expect(requestPaymentAction({ untrusted: 'ignored' })).resolves.toBe(success);
    expect(service.requestPayment).toHaveBeenCalledTimes(2);
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'authorizes %s management actions',
    async (role) => {
      getSessionMock.mockResolvedValue(session(role));
      vi.mocked(service.getAllPayments).mockResolvedValue(success);
      vi.mocked(service.updatePaymentStatus).mockResolvedValue(success);
      await expect(getAllPaymentsAction({ status: 'paid' })).resolves.toBe(success);
      await expect(updatePaymentStatusAction({ id, status: 'paid' })).resolves.toBe(success);
      expect(service.getAllPayments).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        status: 'paid',
      });
      expect(service.updatePaymentStatus).toHaveBeenCalledWith({ id, status: 'paid' });
    },
  );

  it('rejects customer management requests without exposing the service', async () => {
    await expect(getAllPaymentsAction()).resolves.toMatchObject({ isSuccess: false });
    await expect(updatePaymentStatusAction({ id, status: 'paid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.getAllPayments).not.toHaveBeenCalled();
    expect(service.updatePaymentStatus).not.toHaveBeenCalled();
  });

  it('allows public gateway lookups with validated authorities and no session', async () => {
    getSessionMock.mockResolvedValue(null);
    vi.mocked(service.getGatewayPayment).mockResolvedValue(success);
    await expect(getGatewayPaymentAction({ authority: 'a'.repeat(64) })).resolves.toBe(success);
    expect(service.getGatewayPayment).toHaveBeenCalledWith('a'.repeat(64));
  });
});
