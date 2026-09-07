export type DashboardSalesTrendPoint = {
  period: string;
  orders: number;
  revenue: number;
};

export type DashboardListItem = {
  id: string;
  title: string;
  itemType: 'product' | 'pet';
  quantity?: number;
  revenue?: number;
  unitsSold?: number;
};

export type DashboardRecentOrder = {
  id: string;
  orderNumber: string;
  deliveryState: number;
  totalPrice: number;
  createdAt: string;
  customerName: string;
};

export type DashboardViewModel = {
  summary: {
    orders: number;
    netRevenue: number;
    averageOrderValue: number;
    customersTotal: number;
    newCustomers: number;
    productsTotal: number;
    productsEnabled: number;
    productsLowStock: number;
    petsTotal: number;
    petsEnabled: number;
    petsLowStock: number;
  };
  salesTrend: DashboardSalesTrendPoint[];
  topSellingItems: DashboardListItem[];
  lowStockItems: DashboardListItem[];
  recentOrders: DashboardRecentOrder[];
};
