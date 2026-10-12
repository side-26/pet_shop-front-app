import { Expose, instanceToPlain, Transform, Type } from 'class-transformer';

import type {
  DashboardMetricsDTO,
  DashboardRecentOrderDTO,
} from '@/entities/dashboard/dashboard.dto';
import { transform } from '@/lib/transform';

function customerName(user: DashboardRecentOrderDTO['user']) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return name || user?.phoneNumber || 'کاربر ناشناس';
}

export function formatDashboardJalaliPeriod(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(date);
}

export class DashboardSalesTrendPoint {
  @Expose()
  @Transform(({ value }) => formatDashboardJalaliPeriod(value), { toClassOnly: true })
  declare period: string;

  @Expose()
  declare orders: number;

  @Expose()
  declare revenue: number;
}

export class DashboardListItem {
  @Expose()
  @Transform(({ obj }) => obj.itemId, { toClassOnly: true })
  declare id: string;

  @Expose()
  declare title: string;

  @Expose()
  declare itemType: 'product' | 'pet';

  @Expose()
  declare quantity?: number;

  @Expose()
  declare revenue?: number;

  @Expose()
  declare unitsSold?: number;
}

export class DashboardRecentOrder {
  @Expose()
  @Transform(({ obj }) => obj._id, { toClassOnly: true })
  declare id: string;

  @Expose()
  declare orderNumber: string;

  @Expose()
  declare deliveryState: number;

  @Expose()
  declare totalPrice: number;

  @Expose()
  declare createdAt: string;

  @Expose()
  @Transform(({ obj }) => customerName(obj.user), { toClassOnly: true })
  declare customerName: string;
}

export class DashboardSummary {
  @Expose()
  declare orders: number;

  @Expose()
  declare netRevenue: number;

  @Expose()
  declare averageOrderValue: number;

  @Expose()
  @Transform(({ obj }) => obj.customers.total, { toClassOnly: true })
  declare customersTotal: number;

  @Expose()
  @Transform(({ obj }) => obj.customers.newInPeriod, { toClassOnly: true })
  declare newCustomers: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.products.total, { toClassOnly: true })
  declare productsTotal: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.products.enabled, { toClassOnly: true })
  declare productsEnabled: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.products.lowStock, { toClassOnly: true })
  declare productsLowStock: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.pets.total, { toClassOnly: true })
  declare petsTotal: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.pets.enabled, { toClassOnly: true })
  declare petsEnabled: number;

  @Expose()
  @Transform(({ obj }) => obj.catalog.pets.lowStock, { toClassOnly: true })
  declare petsLowStock: number;
}

export class DashboardViewModel {
  @Expose()
  @Type(() => DashboardSummary)
  declare summary: DashboardSummary;

  @Expose()
  @Type(() => DashboardSalesTrendPoint)
  declare salesTrend: DashboardSalesTrendPoint[];

  @Expose()
  @Type(() => DashboardListItem)
  declare topSellingItems: DashboardListItem[];

  @Expose()
  @Type(() => DashboardListItem)
  declare lowStockItems: DashboardListItem[];

  @Expose()
  @Type(() => DashboardRecentOrder)
  declare recentOrders: DashboardRecentOrder[];
}

export function toDashboardViewModel(metrics: DashboardMetricsDTO) {
  return instanceToPlain(transform(DashboardViewModel, metrics), {
    exposeUnsetFields: false,
  }) as DashboardViewModel;
}
