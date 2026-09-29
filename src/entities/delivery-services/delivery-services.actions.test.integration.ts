import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  createDeliveryServiceAction,
  deleteDeliveryServiceAction,
  getAllDeliveryServicesAction,
  getAvailableDeliveryServicesAction,
  updateDeliveryServiceAction,
} from './delivery-services.actions';
import * as service from './delivery-services.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./delivery-services.service', () => ({
  createDeliveryService: vi.fn(),
  deleteDeliveryService: vi.fn(),
  disableDeliveryService: vi.fn(),
  enableDeliveryService: vi.fn(),
  getAllDeliveryServices: vi.fn(),
  getAvailableDeliveryServices: vi.fn(),
  getDeliveryServiceById: vi.fn(),
  updateDeliveryService: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439012';
const input = {
  title: ' Courier ',
  title_fa: ' پیک ',
  logo: 'https://cdn.example.test/courier.webp',
  originCoordinates: [51.389, 35.689],
  availability: {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  },
  pricePerKilometerInCity: 1000,
  pricePerKilometer: 2000,
};
const success = { isSuccess: true as const, message: 'ok', data: {} as never };
const session = (role: AuthSessionModel['role']): AuthSessionModel => ({
  accessExp: 1,
  accessToken: 'token',
  refreshToken: 'refresh',
  role,
  sessionExp: 2,
  userId: 'user',
});

describe('delivery service actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('allows public validated coordinate lookups without a session', async () => {
    getSessionMock.mockResolvedValue(null);
    vi.mocked(service.getAvailableDeliveryServices).mockResolvedValue(success);
    await expect(
      getAvailableDeliveryServicesAction({ lat: '35.689', lng: '51.389' }),
    ).resolves.toBe(success);
    expect(service.getAvailableDeliveryServices).toHaveBeenCalledWith({ lat: 35.689, lng: 51.389 });
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'authorizes and validates management actions for %s',
    async (role) => {
      getSessionMock.mockResolvedValue(session(role));
      vi.mocked(service.getAllDeliveryServices).mockResolvedValue(success);
      vi.mocked(service.createDeliveryService).mockResolvedValue(success);
      vi.mocked(service.updateDeliveryService).mockResolvedValue(success);
      await expect(
        getAllDeliveryServicesAction({ includeDisabled: 'true', ignored: true }),
      ).resolves.toBe(success);
      await expect(createDeliveryServiceAction(input)).resolves.toBe(success);
      await expect(updateDeliveryServiceAction({ id, ...input })).resolves.toBe(success);
      expect(service.getAllDeliveryServices).toHaveBeenCalledWith({ includeDisabled: true });
      expect(service.createDeliveryService).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Courier', basePrice: 0 }),
      );
      expect(service.updateDeliveryService).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ title_fa: 'پیک' }),
      );
    },
  );

  it('rejects unprivileged and invalid destructive requests before services', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(deleteDeliveryServiceAction({ id })).resolves.toMatchObject({ isSuccess: false });
    expect(service.deleteDeliveryService).not.toHaveBeenCalled();

    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
    await expect(deleteDeliveryServiceAction({ id: 'invalid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    await expect(getAvailableDeliveryServicesAction({ lat: 100, lng: 0 })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.deleteDeliveryService).not.toHaveBeenCalled();
    expect(service.getAvailableDeliveryServices).not.toHaveBeenCalled();
  });
});
