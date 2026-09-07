import type { DashboardViewModel } from './dashboard.types';

export const dashboardSkeletonData: DashboardViewModel = {
  summary: {
    orders: 0,
    netRevenue: 0,
    averageOrderValue: 0,
    customersTotal: 0,
    newCustomers: 0,
    productsTotal: 0,
    productsEnabled: 0,
    productsLowStock: 0,
    petsTotal: 0,
    petsEnabled: 0,
    petsLowStock: 0,
  },
  salesTrend: Array.from({ length: 6 }, (_, index) => ({
    period: `بازه ${index + 1}`,
    orders: 0,
    revenue: 0,
  })),
  topSellingItems: Array.from({ length: 4 }, (_, index) => ({
    id: `skeleton-top-${index + 1}`,
    title: 'عنوان محصول پرفروش',
    itemType: 'product' as const,
    unitsSold: 0,
    revenue: 0,
  })),
  lowStockItems: Array.from({ length: 4 }, (_, index) => ({
    id: `skeleton-stock-${index + 1}`,
    title: 'عنوان کالای کم‌موجود',
    itemType: 'product' as const,
    quantity: 0,
  })),
  recentOrders: Array.from({ length: 4 }, (_, index) => ({
    id: `skeleton-order-${index + 1}`,
    orderNumber: `ORD-${index + 1}`,
    deliveryState: 0,
    totalPrice: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    customerName: 'نام مشتری',
  })),
};
