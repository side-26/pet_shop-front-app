import { PawPrintIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { DashboardListItem } from './dashboard.types';

export function DashboardLowStockCard({ items }: Readonly<{ items: DashboardListItem[] }>) {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>نیازمند تأمین</CardTitle>
        <CardDescription>اقلامی که موجودی آن‌ها پایین است.</CardDescription>
      </CardHeader>
      <CardContent className="tw:grid tw:gap-3">
        {items.map((item) => (
          <div key={item.id} className="tw:flex tw:items-center tw:justify-between tw:gap-3">
            <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2">
              <PawPrintIcon aria-hidden="true" className="tw:shrink-0 tw:text-warning" />
              <span className="tw:truncate">{item.title}</span>
            </div>
            <Badge color="warning" variant="tonal">
              {item.quantity?.toLocaleString('fa-IR')} باقی‌مانده
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
