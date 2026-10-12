import { cn } from '@/lib/utils';

import { DashboardInventoryStatusCard } from './dashboard-inventory-status-card';
import { DashboardLowStockCard } from './dashboard-low-stock-card';
import { DashboardMetricsSection } from './dashboard-metrics-section';
import { DashboardSalesTrendCard } from './dashboard-sales-trend-card';
import { DashboardTopSellingCard } from './dashboard-top-selling-card';
import type { DashboardViewModel } from './dashboard.types';

type DashboardContentRendererProps = { dashboard: DashboardViewModel; isSkeleton?: boolean };

export function DashboardContentRenderer({
  dashboard,
  isSkeleton = false,
}: DashboardContentRendererProps) {
  const { summary } = dashboard;

  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4 tw:overflow-y-auto tw:overscroll-contain tw:sm:gap-6',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <header className="tw:flex tw:flex-col tw:gap-1">
        <h1 className="tw:text-heading-4 tw:text-foreground">داشبورد مدیریت</h1>
        <p className="tw:text-body-m tw:text-muted-foreground">
          مرور فروش، موجودی و سفارش‌های اخیر.
        </p>
      </header>

      <DashboardMetricsSection summary={summary} />

      <div className="tw:grid tw:gap-4 tw:xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,1fr)]">
        <DashboardSalesTrendCard data={dashboard.salesTrend} />
        <DashboardInventoryStatusCard summary={summary} />
      </div>

      <div className="tw:grid tw:gap-4 tw:xl:grid-cols-2">
        <DashboardTopSellingCard items={dashboard.topSellingItems} />
        <DashboardLowStockCard items={dashboard.lowStockItems} />
      </div>
    </section>
  );
}
