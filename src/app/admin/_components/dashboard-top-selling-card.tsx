import { PackageCheckIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { DashboardListItem } from './dashboard.types';

export function DashboardTopSellingCard({ items }: Readonly<{ items: DashboardListItem[] }>) {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>پرفروش‌ترین‌ها</CardTitle>
        <CardDescription>بر پایه تعداد فروش در بازه.</CardDescription>
      </CardHeader>
      <CardContent className="tw:grid tw:gap-3">
        {items.map((item) => (
          <div key={item.id} className="tw:flex tw:items-center tw:justify-between tw:gap-3">
            <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2">
              <PackageCheckIcon aria-hidden="true" className="tw:shrink-0 tw:text-primary" />
              <span className="tw:truncate">{item.title}</span>
            </div>
            <Badge color="neutral" variant="tonal">
              {item.unitsSold?.toLocaleString()} فروش
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
