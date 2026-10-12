'use client';

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

const lineChartColors = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  white: 'white',
  neutral: 'var(--muted-foreground)',
  success: 'var(--success)',
} as const;

type LineChartColor = keyof typeof lineChartColors;

type LineChartSeries = Readonly<{
  color?: LineChartColor;
  dataKey: string;
  label: string;
}>;

type LineChartProps<TData extends Record<string, unknown>> = Readonly<{
  ariaLabel: string;
  className?: string;
  data: readonly TData[];
  series: readonly LineChartSeries[];
  xAxisDataKey: string;
}>;

function LineChart<TData extends Record<string, unknown>>({
  ariaLabel,
  className,
  data,
  series,
  xAxisDataKey,
}: LineChartProps<TData>) {
  const config = Object.fromEntries(
    series.map(({ color = 'primary', dataKey, label }) => [
      dataKey,
      { color: lineChartColors[color], label },
    ]),
  ) satisfies ChartConfig;

  return (
    <ChartContainer
      aria-label={ariaLabel}
      config={config}
      className={cn('tw:min-h-56 tw:w-full', className)}
      role="img"
    >
      <RechartsLineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xAxisDataKey} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map(({ dataKey }) => (
          <Line
            key={dataKey}
            dataKey={dataKey}
            stroke={`var(--color-${dataKey})`}
            strokeWidth={2}
            type="monotone"
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}

export { LineChart, lineChartColors };
export type { LineChartColor, LineChartProps, LineChartSeries };
