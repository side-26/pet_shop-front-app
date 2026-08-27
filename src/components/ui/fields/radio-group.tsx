'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { cn } from '@/lib/utils';
import {
  neutralInteractionClasses,
  selectionStateClasses,
  type SelectionColor,
  type SelectionSize,
  type SelectionVariant,
} from './selection-control.styles';

function RadioGroup<Value>({ className, ...props }: RadioGroupPrimitive.Props<Value>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('tw:grid tw:gap-3', className)}
      {...props}
    />
  );
}

type RadioGroupItemProps<Value> = RadioPrimitive.Root.Props<Value> & {
  variant?: SelectionVariant;
  checkedColor?: SelectionColor;
  uncheckedColor?: SelectionColor;
  size?: SelectionSize;
};

const radioSizes: Record<SelectionSize, { root: string; indicator: string }> = {
  xs: { root: 'tw:size-3.5', indicator: 'tw:size-1.5' },
  sm: { root: 'tw:size-4', indicator: 'tw:size-2' },
  md: { root: 'tw:size-5', indicator: 'tw:size-2.5' },
  lg: { root: 'tw:size-6', indicator: 'tw:size-3' },
  xl: { root: 'tw:size-7', indicator: 'tw:size-3.5' },
};

function RadioGroupItem<Value>({
  className,
  variant = 'fill',
  checkedColor = 'primary',
  uncheckedColor = 'secondary',
  size = 'md',
  ...props
}: RadioGroupItemProps<Value>) {
  return (
    <RadioPrimitive.Root
      data-slot="field-control"
      data-variant={variant}
      data-checked-color={checkedColor}
      data-unchecked-color={uncheckedColor}
      data-size={size}
      className={cn(
        'tw:peer tw:flex tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:outline-none tw:transition-colors tw:focus-visible:ring-3 tw:focus-visible:ring-ring/25 tw:aria-invalid:border-error tw:aria-invalid:ring-error/20 tw:disabled:cursor-not-allowed tw:data-readonly:cursor-default tw:motion-reduce:transition-none',
        radioSizes[size].root,
        selectionStateClasses(variant, checkedColor, uncheckedColor),
        neutralInteractionClasses(),
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn('tw:rounded-full tw:bg-current', radioSizes[size].indicator)}
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
