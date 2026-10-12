import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardSalesChart } from './dashboard-sales-chart';
import type { DashboardSalesTrendPoint } from './dashboard.types';

export function DashboardSalesTrendCard({ data }: Readonly<{ data: DashboardSalesTrendPoint[] }>) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>روند سفارش‌ها</CardTitle>
        <CardDescription>تعداد سفارش‌های ثبت‌شده در بازه انتخابی.</CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardSalesChart data={data} />
      </CardContent>
    </Card>
  );
}
