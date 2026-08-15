'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  neutralInteractionClasses,
  selectionStateClasses,
  type SelectionColor,
  type SelectionSize,
  type SelectionVariant,
} from './selection-control.styles';

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  variant?: SelectionVariant;
  checkedColor?: SelectionColor;
  uncheckedColor?: SelectionColor;
  size?: SelectionSize;
};

const checkboxSizes: Record<SelectionSize, string> = {
  xs: 'tw:size-3.5 tw:rounded-sm tw:[&_svg]:size-2.5',
  sm: 'tw:size-4 tw:rounded-sm tw:[&_svg]:size-3',
  md: 'tw:size-5 tw:rounded-md tw:[&_svg]:size-3.5',
  lg: 'tw:size-6 tw:rounded-md tw:[&_svg]:size-4',
  xl: 'tw:size-7 tw:rounded-lg tw:[&_svg]:size-5',
};

function Checkbox({
  className,
  variant = 'fill',
  checkedColor = 'primary',
  uncheckedColor = 'secondary',
  size = 'md',
  ...props
}: CheckboxProps) {
  const stateClasses = selectionStateClasses(variant, checkedColor, uncheckedColor);
  return (
    <CheckboxPrimitive.Root
      data-slot="field-control"
      data-variant={variant}
      data-checked-color={checkedColor}
      data-unchecked-color={uncheckedColor}
      data-size={size}
      className={cn(
        'tw:peer tw:flex tw:shrink-0 tw:items-center tw:justify-center tw:border tw:outline-none tw:transition-colors tw:focus-visible:ring-3 tw:focus-visible:ring-ring/25 tw:aria-invalid:border-error tw:aria-invalid:ring-error/20 tw:disabled:cursor-not-allowed tw:data-readonly:cursor-default tw:motion-reduce:transition-none',
        checkboxSizes[size],
        stateClasses,
        stateClasses.replaceAll('data-checked', 'data-indeterminate'),
        neutralInteractionClasses,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="tw:flex tw:items-center tw:justify-center"
      >
        <CheckIcon aria-hidden="true" className="tw:data-indeterminate:hidden" />
        <MinusIcon aria-hidden="true" className="tw:hidden tw:data-indeterminate:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, type CheckboxProps };
