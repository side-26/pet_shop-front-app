import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { DashboardSummary } from './dashboard.types';

export function DashboardInventoryStatusCard({ summary }: Readonly<{ summary: DashboardSummary }>) {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>وضعیت موجودی</CardTitle>
        <CardDescription>نمای کلی اقلام قابل فروش.</CardDescription>
      </CardHeader>
      <CardContent className="tw:grid tw:gap-4">
        <div className="tw:flex tw:items-center tw:justify-between">
          <span>محصولات فعال</span>
          <Badge color="success" variant="tonal">
            {summary.productsEnabled.toLocaleString()} از {summary.productsTotal.toLocaleString()}
          </Badge>
        </div>
        <div className="tw:flex tw:items-center tw:justify-between">
          <span>حیوانات فعال</span>
          <Badge color="success" variant="tonal">
            {summary.petsEnabled.toLocaleString()} از {summary.petsTotal.toLocaleString()}
          </Badge>
        </div>
        <div className="tw:flex tw:items-center tw:justify-between">
          <span>کم‌موجود</span>
          <Badge color="warning" variant="tonal">
            {(summary.productsLowStock + summary.petsLowStock).toLocaleString()} مورد
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
