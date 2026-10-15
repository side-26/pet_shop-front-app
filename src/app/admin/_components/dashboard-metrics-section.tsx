import {
  ChartNoAxesCombinedIcon,
  PackageCheckIcon,
  ShoppingBagIcon,
  UsersRoundIcon,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';

import type { DashboardSummary } from './dashboard.types';

type MetricCardProps = Readonly<{
  description: string;
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}>;

function MetricCard({ description, icon: Icon, label, value }: MetricCardProps) {
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

export function DashboardMetricsSection({ summary }: Readonly<{ summary: DashboardSummary }>) {
  return (
    <section
      aria-label="شاخص‌های کلیدی"
      className="tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:xl:grid-cols-4"
    >
      <MetricCard
        icon={ShoppingBagIcon}
        label="سفارش‌ها"
        value={summary.orders.toLocaleString()}
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
        value={summary.customersTotal.toLocaleString()}
        description={`${summary.newCustomers.toLocaleString()} مشتری جدید`}
      />
      <MetricCard
        icon={PackageCheckIcon}
        label="میانگین سفارش"
        value={<Price number={summary.averageOrderValue} />}
        description="ارزش متوسط هر سفارش"
      />
    </section>
  );
}
