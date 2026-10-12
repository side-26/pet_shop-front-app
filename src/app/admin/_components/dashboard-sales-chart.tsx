import { LineChart } from '@/components/ui/charts';

import type { DashboardSalesTrendPoint } from './dashboard.types';

type DashboardSalesChartProps = { data: DashboardSalesTrendPoint[] };

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  return (
    <LineChart
      ariaLabel="روند سفارش‌های ثبت‌شده"
      className="tw:min-h-64"
      data={data}
      series={[{ color: 'primary', dataKey: 'orders', label: 'سفارش‌ها' }]}
      xAxisDataKey="period"
    />
  );
}
