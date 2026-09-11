'use client';

import { createContext, useContext, useId } from 'react';
import type * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type { TooltipPayloadEntry, TooltipValueType } from 'recharts';

import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

const ChartContext = createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within a <ChartContainer />');
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          'tw:flex tw:aspect-video tw:justify-center tw:text-xs',
          'tw:[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          'tw:[&_.recharts-cartesian-grid_line]:stroke-border/50',
          'tw:[&_.recharts-layer]:outline-hidden tw:[&_.recharts-surface]:outline-hidden tw:[&_.recharts-tooltip-cursor]:fill-muted',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.color ?? item.theme);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, selector]) =>
              `${selector} [data-chart=${id}] {\n${colorConfig
                .map(([key, item]) => {
                  const color = item.theme?.[theme as keyof typeof item.theme] ?? item.color;
                  return color ? `  --color-${key}: ${color};` : '';
                })
                .join('\n')}\n}`,
          )
          .join('\n'),
      }}
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = React.ComponentProps<'div'> & {
  active?: boolean;
  payload?: TooltipPayloadEntry<TooltipValueType, string>[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel = false,
  hideIndicator = false,
  label,
  nameKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  const labelText = typeof label === 'string' ? (config[label]?.label ?? label) : label;
  return (
    <div
      className={cn(
        'tw:grid tw:min-w-32 tw:gap-1.5 tw:rounded-xl tw:bg-popover tw:px-2.5 tw:py-1.5 tw:text-xs tw:text-popover-foreground tw:shadow-lg tw:ring-1 tw:ring-foreground/5',
        className,
      )}
    >
      {!hideLabel && labelText ? <div className="tw:font-medium">{labelText}</div> : null}
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = String(nameKey ?? item.name ?? item.dataKey ?? 'value');
          const itemConfig = config[key];
          const color = item.payload?.fill ?? item.color;
          return (
            <div key={index} className="tw:flex tw:items-center tw:gap-2">
              {!hideIndicator ? (
                <span
                  aria-hidden="true"
                  className="tw:size-2.5 tw:rounded-[2px]"
                  style={{ backgroundColor: String(color) }}
                />
              ) : null}
              <span className="tw:flex-1 tw:text-muted-foreground">{itemConfig?.label ?? key}</span>
              <span className="tw:font-mono tw:font-medium tw:tabular-nums">
                {item.value == null
                  ? ''
                  : typeof item.value === 'number'
                    ? item.value.toLocaleString()
                    : String(item.value)}
              </span>
            </div>
          );
        })}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  payload,
}: React.ComponentProps<'div'> & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn('tw:flex tw:flex-wrap tw:justify-center tw:gap-4 tw:pt-3', className)}>
      {payload.map((item, index) => {
        const key = String(item.dataKey ?? 'value');
        return (
          <div key={index} className="tw:flex tw:items-center tw:gap-1.5">
            <span
              aria-hidden="true"
              className="tw:size-2 tw:rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span>{config[key]?.label ?? item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
};

export type { TooltipValueType };
