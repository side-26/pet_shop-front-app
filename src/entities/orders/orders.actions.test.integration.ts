import { beforeEach, describe, expect, it, vi } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { createOrderAction, getAllOrdersAction } from './orders.actions';
import * as service from './orders.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./orders.service', () => ({
  createOrder: vi.fn(),
  getAllOrders: vi.fn(),
  getUserOrder: vi.fn(),
  getUserOrders: vi.fn(),
  updateOrderDeliveryState: vi.fn(),
  updateOrderShippingInfo: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const createOrderMock = vi.mocked(service.createOrder);
const getAllOrdersMock = vi.mocked(service.getAllOrders);

describe('orders actions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('passes the authenticated customer ID to checkout so dependent profile data can refresh', async () => {
    getSessionMock.mockResolvedValue({
      userId: 'user-1',
      role: USER_ROLES.CUSTOMER,
    } as Awaited<ReturnType<typeof getSession>>);
    createOrderMock.mockResolvedValue({ isSuccess: true, message: 'created', data: {} } as never);

    await createOrderAction({ paymentTrackingId: 'payment-1' });

    expect(createOrderMock).toHaveBeenCalledWith({ paymentTrackingId: 'payment-1' }, 'user-1');
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'allows the %s management role to read all orders',
    async (role) => {
      getSessionMock.mockResolvedValue({ role } as Awaited<ReturnType<typeof getSession>>);
      getAllOrdersMock.mockResolvedValue({ isSuccess: true, message: null, data: {} } as never);

      await getAllOrdersAction();

      expect(getAllOrdersMock).toHaveBeenCalledWith({ page: 1, limit: 10, sort: 'createdAt' });
    },
  );

  it('rejects a customer from management order reads', async () => {
    getSessionMock.mockResolvedValue({ role: USER_ROLES.CUSTOMER } as Awaited<
      ReturnType<typeof getSession>
    >);

    await expect(getAllOrdersAction()).resolves.toMatchObject({ isSuccess: false });

    expect(getAllOrdersMock).not.toHaveBeenCalled();
  });
});
