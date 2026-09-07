import type { DashboardMetricsDTO } from '@/entities/dashboard/dashboard.dto';

import type { DashboardViewModel } from './dashboard.types';

function customerName(order: DashboardMetricsDTO['recentOrders'][number]) {
  const name = [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ').trim();
  return name || order.user?.phoneNumber || 'کاربر ناشناس';
}

export function mapDashboardMetrics(metrics: DashboardMetricsDTO): DashboardViewModel {
  return {
    summary: {
      orders: metrics.summary.orders,
      netRevenue: metrics.summary.netRevenue,
      averageOrderValue: metrics.summary.averageOrderValue,
      customersTotal: metrics.summary.customers.total,
      newCustomers: metrics.summary.customers.newInPeriod,
      productsTotal: metrics.summary.catalog.products.total,
      productsEnabled: metrics.summary.catalog.products.enabled,
      productsLowStock: metrics.summary.catalog.products.lowStock,
      petsTotal: metrics.summary.catalog.pets.total,
      petsEnabled: metrics.summary.catalog.pets.enabled,
      petsLowStock: metrics.summary.catalog.pets.lowStock,
    },
    salesTrend: metrics.salesTrend.map(({ period, orders, revenue }) => ({
      period,
      orders,
      revenue,
    })),
    topSellingItems: metrics.topSellingItems.map((item) => ({
      id: item.itemId,
      title: item.title,
      itemType: item.itemType,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
    })),
    lowStockItems: metrics.lowStockItems.map((item) => ({
      id: item.itemId,
      title: item.title,
      itemType: item.itemType,
      quantity: item.quantity,
    })),
    recentOrders: metrics.recentOrders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      deliveryState: order.deliveryState,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      customerName: customerName(order),
    })),
  };
}
