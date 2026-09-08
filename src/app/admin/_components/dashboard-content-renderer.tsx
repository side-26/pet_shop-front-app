import {
  ChartNoAxesCombinedIcon,
  PackageCheckIcon,
  PawPrintIcon,
  ShoppingBagIcon,
  UsersRoundIcon,
} from 'lucide-react';

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
import { cn } from '@/lib/utils';

import { DashboardSalesChart } from './dashboard-sales-chart';
import type { DashboardViewModel } from './dashboard.types';

type DashboardContentRendererProps = { dashboard: DashboardViewModel; isSkeleton?: boolean };

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

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof ShoppingBagIcon;
  label: string;
  value: React.ReactNode;
  description: string;
}) {
  return (
    <Card size="sm" variant="outlined">
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2 tw:text-title-s">
          <Icon aria-hidden="true" className="tw:text-primary" />
          {label}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="tw:text-heading-5 tw:font-bold tw:tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardContentRenderer({
  dashboard,
  isSkeleton = false,
}: DashboardContentRendererProps) {
  const { summary } = dashboard;

  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:min-h-0 tw:flex-col tw:gap-4 tw:sm:gap-6',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <header className="tw:flex tw:flex-col tw:gap-1">
        <h1 className="tw:text-heading-4 tw:text-foreground">داشبورد مدیریت</h1>
        <p className="tw:text-body-m tw:text-muted-foreground">
          مرور فروش، موجودی و سفارش‌های اخیر.
        </p>
      </header>

      <div className="tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:xl:grid-cols-4">
        <MetricCard
          icon={ShoppingBagIcon}
          label="سفارش‌ها"
          value={summary.orders.toLocaleString('fa-IR')}
          description="سفارش‌های ثبت‌شده در بازه"
        />
        <MetricCard
          icon={ChartNoAxesCombinedIcon}
          label="فروش خالص"
          value={<Price number={summary.netRevenue} />}
          description="پس از تخفیف و هزینه ارسال"
        />
        <MetricCard
          icon={UsersRoundIcon}
          label="مشتریان"
          value={summary.customersTotal.toLocaleString('fa-IR')}
          description={`${summary.newCustomers.toLocaleString('fa-IR')} مشتری جدید`}
        />
        <MetricCard
          icon={PackageCheckIcon}
          label="میانگین سفارش"
          value={<Price number={summary.averageOrderValue} />}
          description="ارزش متوسط هر سفارش"
        />
      </div>

      <div className="tw:grid tw:gap-4 tw:xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,1fr)]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>روند سفارش‌ها</CardTitle>
            <CardDescription>تعداد سفارش‌های ثبت‌شده در بازه انتخابی.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardSalesChart data={dashboard.salesTrend} />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>وضعیت موجودی</CardTitle>
            <CardDescription>نمای کلی اقلام قابل فروش.</CardDescription>
          </CardHeader>
          <CardContent className="tw:grid tw:gap-4">
            <div className="tw:flex tw:items-center tw:justify-between">
              <span>محصولات فعال</span>
              <Badge color="success" variant="tonal">
                {summary.productsEnabled.toLocaleString('fa-IR')} از{' '}
                {summary.productsTotal.toLocaleString('fa-IR')}
              </Badge>
            </div>
            <div className="tw:flex tw:items-center tw:justify-between">
              <span>حیوانات فعال</span>
              <Badge color="success" variant="tonal">
                {summary.petsEnabled.toLocaleString('fa-IR')} از{' '}
                {summary.petsTotal.toLocaleString('fa-IR')}
              </Badge>
            </div>
            <div className="tw:flex tw:items-center tw:justify-between">
              <span>کم‌موجود</span>
              <Badge color="warning" variant="tonal">
                {(summary.productsLowStock + summary.petsLowStock).toLocaleString('fa-IR')} مورد
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="tw:grid tw:gap-4 tw:xl:grid-cols-2">
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>پرفروش‌ترین‌ها</CardTitle>
            <CardDescription>بر پایه تعداد فروش در بازه.</CardDescription>
          </CardHeader>
          <CardContent className="tw:grid tw:gap-3">
            {dashboard.topSellingItems.map((item) => (
              <div key={item.id} className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2">
                  <PackageCheckIcon aria-hidden="true" className="tw:shrink-0 tw:text-primary" />
                  <span className="tw:truncate">{item.title}</span>
                </div>
                <Badge color="neutral" variant="tonal">
                  {item.unitsSold?.toLocaleString('fa-IR')} فروش
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>نیازمند تأمین</CardTitle>
            <CardDescription>اقلامی که موجودی آن‌ها پایین است.</CardDescription>
          </CardHeader>
          <CardContent className="tw:grid tw:gap-3">
            {dashboard.lowStockItems.map((item) => (
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
      </div>

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
              {dashboard.recentOrders.map((order) => (
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
    </section>
  );
}
