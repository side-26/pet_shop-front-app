import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const progressVariants = tv({
  slots: {
    root: 'tw:flex tw:w-full tw:flex-col tw:gap-1.5',
    header: 'tw:flex tw:items-center tw:justify-between tw:gap-3',
    label: 'tw:font-medium tw:tabular-nums tw:text-muted-foreground',
    track: 'tw:relative tw:w-full tw:overflow-hidden tw:rounded-full tw:bg-muted',
    indicator:
      'tw:h-full tw:rounded-full tw:transition-[width,background-color] tw:duration-300 tw:ease-out tw:motion-reduce:transition-none',
  },
  variants: {
    size: {
      xs: { root: 'tw:gap-1', label: 'tw:text-label-xs', track: 'tw:h-1' },
      sm: { root: 'tw:gap-1', label: 'tw:text-label-s', track: 'tw:h-1.5' },
      md: { root: 'tw:gap-1.5', label: 'tw:text-label-m', track: 'tw:h-2' },
      lg: { root: 'tw:gap-2', label: 'tw:text-label-l', track: 'tw:h-2.5' },
      xl: { root: 'tw:gap-2', label: 'tw:text-body-m', track: 'tw:h-3' },
    },
    color: {
      neutral: { indicator: 'tw:bg-foreground' },
      primary: { indicator: 'tw:bg-primary' },
      secondary: { indicator: 'tw:bg-secondary' },
      info: { indicator: 'tw:bg-info' },
      success: { indicator: 'tw:bg-success' },
      error: { indicator: 'tw:bg-error' },
    },
  },
  defaultVariants: { size: 'md', color: 'primary' },
});

type ProgressColor = NonNullable<VariantProps<typeof progressVariants>['color']>;

export type ProgressProps = Omit<ComponentProps<'div'>, 'children' | 'color'> &
  VariantProps<typeof progressVariants> & {
    value: number;
    fullColor?: ProgressColor;
    children?: ReactNode;
    showLabel?: boolean;
  };

function normalizeProgress(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function Progress({
  value,
  size = 'md',
  color = 'primary',
  fullColor = 'success',
  children,
  showLabel = true,
  className,
  'aria-label': ariaLabel,
  ...props
}: ProgressProps) {
  const percentage = normalizeProgress(value);
  const isComplete = percentage === 100;
  const styles = progressVariants({ size, color: isComplete ? fullColor : color });

  return (
    <div
      data-slot="progress"
      data-size={size}
      data-color={color}
      data-full-color={fullColor}
      data-complete={isComplete || undefined}
      className={cn(styles.root(), className)}
      {...props}
    >
      {showLabel || (isComplete && children) ? (
        <div className={styles.header()}>
          {isComplete && children ? <div data-slot="progress-complete">{children}</div> : <span />}
          {showLabel ? <span className={styles.label()}>{percentage}%</span> : null}
        </div>
      ) : null}
      <div
        data-slot="progress-track"
        role="progressbar"
        aria-label={ariaLabel ?? `پیشرفت ${percentage} درصد`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={`${percentage}%`}
        className={styles.track()}
      >
        <div
          data-slot="progress-indicator"
          className={styles.indicator()}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { Progress, progressVariants };
