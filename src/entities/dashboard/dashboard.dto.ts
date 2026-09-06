import type { DashboardMetricsQueryInput } from './dashboard.schema';

export type DashboardMetricsQueryDTO = DashboardMetricsQueryInput;

export type DashboardDeliveryStateCountDTO = {
  deliveryState: number;
  count: number;
};

export type DashboardSalesTrendDTO = {
  period: string;
  orders: number;
  revenue: number;
  unitsSold: number;
};

export type DashboardTopSellingItemDTO = {
  itemId: string;
  itemType: 'product' | 'pet';
  title: string;
  mainImage: string;
  unitsSold: number;
  revenue: number;
};

export type DashboardLowStockItemDTO = {
  itemId: string;
  itemType: 'product' | 'pet';
  title: string;
  mainImage: string;
  quantity: number;
};

export type DashboardRecentOrderDTO = {
  _id: string;
  orderNumber: string;
  deliveryState: number;
  totalPrice: number;
  discountPrice: number;
  shippingPrice: number;
  createdAt: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  } | null;
};

export type DashboardMetricsDTO = {
  period: {
    fromDate: string;
    toDate: string;
    groupBy: DashboardMetricsQueryDTO['groupBy'];
    timeZone: 'Asia/Tehran';
  };
  summary: {
    orders: number;
    grossRevenue: number;
    discountTotal: number;
    shippingRevenue: number;
    netRevenue: number;
    unitsSold: number;
    averageOrderValue: number;
    customers: { total: number; newInPeriod: number };
    catalog: {
      products: { total: number; enabled: number; lowStock: number };
      pets: { total: number; enabled: number; lowStock: number };
    };
  };
  ordersByDeliveryState: DashboardDeliveryStateCountDTO[];
  salesTrend: DashboardSalesTrendDTO[];
  topSellingItems: DashboardTopSellingItemDTO[];
  lowStockItems: DashboardLowStockItemDTO[];
  recentOrders: DashboardRecentOrderDTO[];
};
