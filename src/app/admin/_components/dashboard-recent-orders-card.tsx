import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { DashboardRecentOrder } from './dashboard.types';

const deliveryStateLabels: Record<number, string> = {
  0: 'در انتظار بررسی',
  1: 'در حال آماده‌سازی',
  2: 'ارسال شده',
  3: 'تحویل شده',
  4: 'لغو شده',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Tehran',
  }).format(new Date(value));
}

export function DashboardRecentOrdersCard({
  orders,
}: Readonly<{ orders: DashboardRecentOrder[] }>) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>سفارش‌های اخیر</CardTitle>
        <CardDescription>آخرین سفارش‌های ثبت‌شده در فروشگاه.</CardDescription>
      </CardHeader>
      <CardContent className="tw:px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div>شماره سفارش</div>
              </TableHead>
              <TableHead>
                <div>مشتری</div>
              </TableHead>
              <TableHead>
                <div>وضعیت</div>
              </TableHead>
              <TableHead>
                <div>مبلغ</div>
              </TableHead>
              <TableHead>
                <div>تاریخ</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <bdi dir="ltr" className="tw:font-medium">
                    {order.orderNumber}
                  </bdi>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <Badge color="neutral" variant="tonal">
                    {deliveryStateLabels[order.deliveryState] ?? 'نامشخص'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Price number={order.totalPrice} />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
