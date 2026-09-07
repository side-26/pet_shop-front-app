'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import type { DashboardSalesTrendPoint } from './dashboard.types';

const chartConfig = {
  orders: { label: 'سفارش‌ها', color: 'var(--chart-1)' },
} satisfies ChartConfig;

type DashboardSalesChartProps = { data: DashboardSalesTrendPoint[] };

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  return (
    <ChartContainer config={chartConfig} className="tw:min-h-64 tw:w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="period" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="orders" fill="var(--color-orders)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
