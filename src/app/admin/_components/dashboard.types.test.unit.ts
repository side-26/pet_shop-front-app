import { describe, expect, it } from 'vitest';

import type { DashboardMetricsDTO } from '@/entities/dashboard/dashboard.dto';

import { formatDashboardJalaliPeriod, toDashboardViewModel } from './dashboard.types';

describe('toDashboardViewModel', () => {
  it('formats dashboard sales periods as Jalali dates', () => {
    expect(formatDashboardJalaliPeriod('2026-01-01T00:00:00.000Z')).toBe('۱۴۰۴/۱۰/۱۱');
    expect(formatDashboardJalaliPeriod('بازه نامعتبر')).toBe('بازه نامعتبر');
  });

  it('projects dashboard metrics through decorated view-model classes', () => {
    const dashboard = toDashboardViewModel({
      period: {
        fromDate: '2026-01-01',
        toDate: '2026-01-31',
        groupBy: 'day',
        timeZone: 'Asia/Tehran',
      },
      summary: {
        orders: 12,
        grossRevenue: 100,
        discountTotal: 10,
        shippingRevenue: 5,
        netRevenue: 95,
        unitsSold: 14,
        averageOrderValue: 8,
        customers: { total: 9, newInPeriod: 3 },
        catalog: {
          products: { total: 20, enabled: 17, lowStock: 2 },
          pets: { total: 6, enabled: 5, lowStock: 1 },
        },
      },
      ordersByDeliveryState: [],
      salesTrend: [{ period: '2026-01-01T00:00:00.000Z', orders: 12, revenue: 95, unitsSold: 14 }],
      topSellingItems: [
        {
          itemId: 'product-1',
          itemType: 'product',
          title: 'غذا',
          mainImage: 'image',
          unitsSold: 7,
          revenue: 50,
        },
      ],
      lowStockItems: [
        { itemId: 'pet-1', itemType: 'pet', title: 'گربه', mainImage: 'image', quantity: 1 },
      ],
      recentOrders: [
        {
          _id: 'order-1',
          orderNumber: '1001',
          deliveryState: 2,
          totalPrice: 95,
          discountPrice: 10,
          shippingPrice: 5,
          createdAt: '2026-01-10T12:00:00.000Z',
          user: { _id: 'user-1', firstName: 'ندا', lastName: 'رضایی', phoneNumber: '09120000000' },
        },
      ],
    } satisfies DashboardMetricsDTO);

    expect(dashboard.summary).toMatchObject({
      customersTotal: 9,
      productsLowStock: 2,
      petsEnabled: 5,
    });
    expect(dashboard.salesTrend).toEqual([{ period: '۱۴۰۴/۱۰/۱۱', orders: 12, revenue: 95 }]);
    expect(dashboard.topSellingItems).toEqual([
      { id: 'product-1', itemType: 'product', title: 'غذا', unitsSold: 7, revenue: 50 },
    ]);
    expect(dashboard.lowStockItems).toEqual([
      { id: 'pet-1', itemType: 'pet', title: 'گربه', quantity: 1 },
    ]);
    expect(dashboard.recentOrders).toEqual([
      {
        id: 'order-1',
        orderNumber: '1001',
        deliveryState: 2,
        totalPrice: 95,
        createdAt: '2026-01-10T12:00:00.000Z',
        customerName: 'ندا رضایی',
      },
    ]);
  });
});
