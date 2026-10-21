import { describe, expect, it } from 'vitest';

import { transform, transformMany } from '@/lib/transform';

import { OrderTableRow, OrdersTableViewModel } from './orders-table.types';

describe('OrderTableRow', () => {
  it('projects only table fields and derives the populated customer name', () => {
    const [order] = transformMany(OrderTableRow, [
      {
        _id: 'order-1',
        user: {
          _id: 'user-1',
          firstName: 'علی',
          lastName: 'رضایی',
          phoneNumber: '09120000000',
          email: 'ali@example.com',
          role: 'customer',
        },
        orderNumber: 'ORD-1',
        trackingCode: 'TRACK-1',
        totalPrice: 250000,
        paymentStatus: 'paid',
        deliveryState: 3,
        internalOnly: 'excluded',
      },
    ]);

    expect(order).toMatchObject({
      id: 'order-1',
      orderNumber: 'ORD-1',
      trackingCode: 'TRACK-1',
      userFullName: 'علی رضایی',
      totalPrice: 250000,
      paymentStatus: 'paid',
      deliveryState: 3,
    });
    expect(order).not.toHaveProperty('internalOnly');
  });

  it('uses a safe placeholder when the API only returns a user id', () => {
    const [order] = transformMany(OrderTableRow, [{ _id: 'order-1', user: 'user-1' }]);

    expect(order.userFullName).toBe('—');
  });

  it('derives pagination and table rows from the API response', () => {
    const viewModel = transform(OrdersTableViewModel, {
      result: [{ _id: 'order-1', user: 'user-1' }],
      pagination: { currentPage: 0, totalPages: 0, totalItems: -1 },
    });

    expect(viewModel).toMatchObject({
      orders: [{ id: 'order-1', userFullName: '—' }],
      page: 1,
      pageCount: 1,
      total: 0,
    });
  });
});
