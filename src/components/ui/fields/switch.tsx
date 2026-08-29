'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';
import {
  neutralInteractionClasses,
  selectionStateClasses,
  type SelectionColor,
  type SelectionSize,
  type SelectionVariant,
} from './selection-control.styles';

type SwitchProps = SwitchPrimitive.Root.Props & {
  variant?: SelectionVariant;
  checkedColor?: SelectionColor;
  uncheckedColor?: SelectionColor;
  size?: SelectionSize;
  loading?: boolean;
};

const switchSizes: Record<SelectionSize, { root: string; thumb: string }> = {
  xs: { root: 'tw:h-4 tw:w-7', thumb: 'tw:size-3 tw:data-checked:-translate-x-3' },
  sm: { root: 'tw:h-5 tw:w-9', thumb: 'tw:size-4 tw:data-checked:-translate-x-4' },
  md: { root: 'tw:h-6 tw:w-11', thumb: 'tw:size-5 tw:data-checked:-translate-x-5' },
  lg: { root: 'tw:h-7 tw:w-13', thumb: 'tw:size-6 tw:data-checked:-translate-x-6' },
  xl: { root: 'tw:h-8 tw:w-15', thumb: 'tw:size-7 tw:data-checked:-translate-x-7' },
};

function Switch({
  className,
  variant = 'fill',
  checkedColor = 'primary',
  uncheckedColor = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="field-control"
      data-variant={variant}
      data-checked-color={checkedColor}
      data-unchecked-color={uncheckedColor}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled || loading}
      className={cn(
        'tw:group/switch tw:peer tw:inline-flex tw:shrink-0 tw:items-center tw:rounded-full tw:border tw:p-0.5 tw:outline-none tw:transition-colors tw:focus-visible:ring-3 tw:focus-visible:ring-ring/25 tw:aria-invalid:border-error tw:aria-invalid:ring-error/20 tw:disabled:cursor-not-allowed tw:data-readonly:cursor-default tw:motion-reduce:transition-none',
        switchSizes[size].root,
        selectionStateClasses(variant, checkedColor, uncheckedColor),
        neutralInteractionClasses({ preserveReadOnlyColors: true }),
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'tw:pointer-events-none tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-background tw:shadow-sm tw:ring-1 tw:ring-foreground/10 tw:transition-transform tw:group-disabled/switch:bg-muted-foreground tw:group-data-loading/switch:bg-background tw:motion-reduce:transition-none',
          switchSizes[size].thumb,
        )}
      >
        {loading ? (
          <Spinner
            aria-hidden="true"
            role="presentation"
            className="tw:size-2/3 tw:text-foreground"
          />
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, type SwitchProps };
