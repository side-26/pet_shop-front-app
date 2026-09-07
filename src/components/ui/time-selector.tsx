'use client';

import * as React from 'react';
import { tv } from 'tailwind-variants';
import type { ButtonProps } from '@/components/ui/button';
import { CalendarSelector } from '@/components/ui/calendar-selector';
import { cn } from '@/lib/utils';

type TimeSelectorAlignment = 'left' | 'center' | 'right';
type TimeSelectorValue = `${string}:${string}:${string}`;
type TimeSelectorDefaultValue = TimeSelectorValue | number;

type TimeSelectorProps = Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  value?: TimeSelectorValue;
  defaultValue?: TimeSelectorDefaultValue;
  onValueChange?: (value: TimeSelectorValue) => void;
  label?: React.ReactNode;
  'aria-label'?: string;
  align?: TimeSelectorAlignment;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
};

const hourItems = createTimeItems(24);
const minuteItems = createTimeItems(60);
const secondItems = createTimeItems(60);

const alignmentClasses: Record<TimeSelectorAlignment, { label: string; selectors: string }> = {
  left: { label: 'tw:text-left', selectors: 'tw:justify-start' },
  center: { label: 'tw:text-center', selectors: 'tw:justify-center' },
  right: { label: 'tw:text-right', selectors: 'tw:justify-end' },
};

const timeSelectorColorVariants = tv({
  slots: {
    label: '',
    separator: '',
  },
  variants: {
    color: {
      primary: { label: 'tw:text-primary', separator: 'tw:text-primary/80' },
      secondary: { label: 'tw:text-secondary-active', separator: 'tw:text-secondary/80' },
      info: { label: 'tw:text-info', separator: 'tw:text-info/80' },
      success: { label: 'tw:text-success', separator: 'tw:text-success/80' },
      warning: { label: 'tw:text-warning-active', separator: 'tw:text-warning/80' },
      error: { label: 'tw:text-error', separator: 'tw:text-error/80' },
    },
  },
  defaultVariants: { color: 'primary' },
});

function createTimeItems(length: number) {
  return Array.from({ length }, (_, value) => ({ value, label: padTimePart(value) }));
}

function padTimePart(value: number) {
  return String(value).padStart(2, '0');
}

function normalizeTime(value: TimeSelectorDefaultValue | undefined): TimeSelectorValue {
  if (typeof value === 'number') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '00:00:00';

    return [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(padTimePart)
      .join(':') as TimeSelectorValue;
  }

  const match = value?.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return '00:00:00';

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  if (hours > 23 || minutes > 59 || seconds > 59) return '00:00:00';

  return `${padTimePart(hours)}:${padTimePart(minutes)}:${padTimePart(seconds)}`;
}

function TimeSelector({
  value,
  defaultValue = '00:00:00',
  onValueChange,
  label = 'زمان',
  'aria-label': ariaLabel,
  align = 'center',
  color = 'primary',
  variant = 'flat',
  disabled,
  className,
  ...props
}: TimeSelectorProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    normalizeTime(defaultValue),
  );
  const currentValue = normalizeTime(value ?? uncontrolledValue);
  const [hours, minutes, seconds] = currentValue.split(':').map(Number);
  const isControlled = value !== undefined;
  const styles = alignmentClasses[align];
  const colors = timeSelectorColorVariants({ color });
  const accessibleName = ariaLabel ?? (typeof label === 'string' ? label : 'انتخاب زمان');

  const updatePart = React.useCallback(
    (part: 0 | 1 | 2, nextPart: number) => {
      const parts = [hours, minutes, seconds];
      parts[part] = nextPart;
      const nextValue = parts.map(padTimePart).join(':') as TimeSelectorValue;

      if (!isControlled) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [hours, isControlled, minutes, onValueChange, seconds],
  );

  return (
    <div
      {...props}
      role="group"
      aria-label={accessibleName}
      aria-disabled={disabled || undefined}
      data-color={color}
      data-variant={variant}
      data-align={align}
      className={cn('tw:flex tw:w-full tw:flex-col tw:gap-2', className)}
    >
      {label ? (
        <span className={cn('tw:w-full tw:text-label-m', styles.label, colors.label())}>
          {label}
        </span>
      ) : null}
      <div className={cn('tw:flex tw:w-full tw:items-center tw:gap-1', styles.selectors)} dir="ltr">
        <CalendarSelector
          items={hourItems}
          value={hours}
          label="ساعت"
          width={68}
          color={color}
          variant={variant}
          disabled={disabled}
          onValueChange={(nextValue) => updatePart(0, nextValue)}
        />
        <span aria-hidden="true" className={cn('tw:text-label-l', colors.separator())}>
          :
        </span>
        <CalendarSelector
          items={minuteItems}
          value={minutes}
          label="دقیقه"
          width={68}
          color={color}
          variant={variant}
          disabled={disabled}
          onValueChange={(nextValue) => updatePart(1, nextValue)}
        />
        <span aria-hidden="true" className={cn('tw:text-label-l', colors.separator())}>
          :
        </span>
        <CalendarSelector
          items={secondItems}
          value={seconds}
          label="ثانیه"
          width={68}
          color={color}
          variant={variant}
          disabled={disabled}
          onValueChange={(nextValue) => updatePart(2, nextValue)}
        />
      </div>
    </div>
  );
}

export {
  TimeSelector,
  type TimeSelectorAlignment,
  type TimeSelectorDefaultValue,
  type TimeSelectorProps,
  type TimeSelectorValue,
};
