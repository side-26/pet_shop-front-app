'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'فروردین', orders: 48 },
  { month: 'اردیبهشت', orders: 62 },
  { month: 'خرداد', orders: 55 },
];

const config = { orders: { label: 'سفارش‌ها', color: 'var(--chart-1)' } } satisfies ChartConfig;

export function ChartShowcase() {
  return (
    <section id="charts" aria-labelledby="charts-title">
      <Card>
        <CardHeader>
          <CardTitle id="charts-title">Chart</CardTitle>
          <CardDescription>نمونه نمودار ستونی با Tooltip سازگار با پوسته.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="tw:min-h-56 tw:w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
