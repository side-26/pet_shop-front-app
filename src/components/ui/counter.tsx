'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

const counterVariants = tv({
  slots: {
    root: 'tw:shrink-0 tw:overflow-hidden tw:rounded-xl',
    value: 'tw:justify-center tw:rounded-none tw:px-2 tw:font-medium',
  },
  variants: {
    variant: {
      fill: { value: 'tw:border-transparent' },
      outlined: { value: 'tw:bg-background/80' },
      tonal: { value: 'tw:border-transparent' },
      flat: { value: 'tw:border-transparent tw:bg-transparent' },
      text: { value: 'tw:border-transparent tw:bg-transparent' },
      transparent: { value: 'tw:bg-background/45 tw:supports-backdrop-filter:backdrop-blur-xl' },
    },
    color: {
      primary: {},
      secondary: {},
      info: {},
      success: {},
      warning: {},
      error: {},
    },
    size: {
      xs: { value: 'tw:min-w-7 tw:text-label-s' },
      sm: { value: 'tw:min-w-8 tw:text-label-m' },
      md: { value: 'tw:min-w-10 tw:text-label-m' },
      lg: { value: 'tw:min-w-11 tw:text-label-l' },
      xl: { value: 'tw:min-w-12 tw:text-label-l' },
    },
  },
  compoundVariants: [
    {
      variant: 'fill',
      color: 'primary',
      class: { value: 'tw:bg-primary tw:text-primary-foreground' },
    },
    {
      variant: 'fill',
      color: 'secondary',
      class: { value: 'tw:bg-secondary tw:text-secondary-foreground' },
    },
    { variant: 'fill', color: 'info', class: { value: 'tw:bg-info tw:text-info-foreground' } },
    {
      variant: 'fill',
      color: 'success',
      class: { value: 'tw:bg-success tw:text-success-foreground' },
    },
    {
      variant: 'fill',
      color: 'warning',
      class: { value: 'tw:bg-warning tw:text-warning-foreground' },
    },
    { variant: 'fill', color: 'error', class: { value: 'tw:bg-error tw:text-error-foreground' } },
    {
      variant: 'tonal',
      color: 'primary',
      class: { value: 'tw:bg-primary-muted tw:text-primary-muted-foreground' },
    },
    {
      variant: 'tonal',
      color: 'secondary',
      class: { value: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground' },
    },
    {
      variant: 'tonal',
      color: 'info',
      class: { value: 'tw:bg-info-muted tw:text-info-muted-foreground' },
    },
    {
      variant: 'tonal',
      color: 'success',
      class: { value: 'tw:bg-success-muted tw:text-success-muted-foreground' },
    },
    {
      variant: 'tonal',
      color: 'warning',
      class: { value: 'tw:bg-warning-muted tw:text-warning-muted-foreground' },
    },
    {
      variant: 'tonal',
      color: 'error',
      class: { value: 'tw:bg-error-muted tw:text-error-muted-foreground' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'primary',
      class: { value: 'tw:text-primary' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'secondary',
      class: { value: 'tw:text-secondary-active' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'info',
      class: { value: 'tw:text-info' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'success',
      class: { value: 'tw:text-success' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'warning',
      class: { value: 'tw:text-warning-active' },
    },
    {
      variant: ['outlined', 'flat', 'text', 'transparent'],
      color: 'error',
      class: { value: 'tw:text-error' },
    },
  ],
  defaultVariants: { variant: 'fill', color: 'primary', size: 'md' },
});

type CounterProps = Omit<React.ComponentProps<'div'>, 'color' | 'defaultValue' | 'onChange'> &
  VariantProps<typeof counterVariants> & {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    onValueChange?: (value: number) => void;
    locale?: Intl.LocalesArgument;
    incrementLabel?: string;
    decrementLabel?: string;
    removeLabel?: string;
  };

type CounterRef = {
  value: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const Counter = forwardRef<CounterRef, CounterProps>(function Counter(
  {
    value,
    defaultValue = 0,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    onValueChange,
    locale = 'fa-IR',
    incrementLabel = 'افزایش مقدار',
    decrementLabel = 'کاهش مقدار',
    removeLabel = 'حذف مقدار',
    variant = 'fill',
    color = 'primary',
    size = 'md',
    className,
    'aria-label': ariaLabel = 'شمارنده',
    ...props
  }: CounterProps,
  ref,
) {
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  const [internalValue, setInternalValue] = useState(() =>
    clamp(defaultValue, lowerBound, upperBound),
  );
  const currentValue = clamp(value ?? internalValue, lowerBound, upperBound);
  const isRemoveAction = lowerBound === 0 && currentValue === 1;
  const styles = counterVariants({ variant, color, size });

  useImperativeHandle(ref, () => ({ value: currentValue }), [currentValue]);

  function updateValue(nextValue: number) {
    const clampedValue = clamp(nextValue, lowerBound, upperBound);
    if (value === undefined) setInternalValue(clampedValue);
    onValueChange?.(clampedValue);
  }

  return (
    <ButtonGroup
      {...props}
      aria-label={ariaLabel}
      data-variant={variant}
      data-color={color}
      data-size={size}
      className={cn(styles.root(), className)}
    >
      <Button
        iconOnly
        size={size}
        variant={variant}
        color={color}
        aria-label={incrementLabel}
        disabled={currentValue >= upperBound}
        onClick={() => updateValue(currentValue + 1)}
      >
        <Plus aria-hidden="true" />
      </Button>
      <ButtonGroupText className={styles.value()}>
        <output aria-live="polite" dir="ltr">
          {currentValue.toLocaleString(locale)}
        </output>
      </ButtonGroupText>
      <Button
        iconOnly
        size={size}
        variant={variant}
        color={color}
        aria-label={isRemoveAction ? removeLabel : decrementLabel}
        data-counter-action={isRemoveAction ? 'remove' : 'decrement'}
        disabled={currentValue <= lowerBound}
        onClick={() => updateValue(currentValue - 1)}
      >
        {isRemoveAction ? (
          <Trash2
            aria-hidden="true"
            data-counter-icon="trash"
            className={variant === 'fill' ? undefined : 'tw:text-error'}
          />
        ) : (
          <Minus aria-hidden="true" data-counter-icon="minus" />
        )}
      </Button>
    </ButtonGroup>
  );
});

export { Counter, counterVariants, type CounterProps, type CounterRef };
