import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { createBrandAction, deleteBrandAction, getAllBrandsAction } from './brands.actions';
import * as service from './brands.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./brands.service', () => ({
  createBrand: vi.fn(),
  deleteBrand: vi.fn(),
  getAllBrands: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439012';
const success = { isSuccess: true as const, message: 'ok', data: {} as never };
const session = (role: AuthSessionModel['role']): AuthSessionModel => ({
  accessExp: 1,
  accessToken: 'token',
  refreshToken: 'refresh',
  role,
  sessionExp: 2,
  userId: 'user',
});

describe('brand actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'validates and delegates management reads and creation for %s',
    async (role) => {
      getSessionMock.mockResolvedValue(session(role));
      vi.mocked(service.getAllBrands).mockResolvedValue(success);
      vi.mocked(service.createBrand).mockResolvedValue(success);
      await expect(getAllBrandsAction({ includeDisabled: 'true', ignored: true })).resolves.toBe(
        success,
      );
      expect(service.getAllBrands).toHaveBeenCalledWith({ includeDisabled: true });
      await expect(
        createBrandAction({ title: '  Royal Canin ', title_fa: ' رویال کنین ' }),
      ).resolves.toBe(success);
      expect(service.createBrand).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Royal Canin', title_fa: 'رویال کنین', isEnable: true }),
      );
    },
  );

  it('rejects non-admin and invalid destructive requests before the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(deleteBrandAction({ id })).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه مشاهده یا مدیریت برندها را ندارید.',
    });
    expect(service.deleteBrand).not.toHaveBeenCalled();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
    await expect(deleteBrandAction({ id: 'invalid' })).resolves.toMatchObject({ isSuccess: false });
    expect(service.deleteBrand).not.toHaveBeenCalled();
  });
});
