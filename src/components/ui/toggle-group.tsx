'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import * as React from 'react';

import { toggleVariants, type ToggleProps } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

type ToggleGroupStyleProps = Pick<ToggleProps, 'variant' | 'color' | 'size'> & {
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
};

const ToggleGroupContext = React.createContext<ToggleGroupStyleProps>({
  variant: 'flat',
  color: 'primary',
  size: 'md',
  spacing: 2,
  orientation: 'horizontal',
});

type ToggleGroupProps<Value extends string = string> = ToggleGroupPrimitive.Props<Value> &
  ToggleGroupStyleProps;

function ToggleGroup<Value extends string = string>({
  className,
  variant = 'flat',
  color = 'primary',
  size = 'md',
  spacing = 2,
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupProps<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      style={{ '--toggle-group-gap': spacing } as React.CSSProperties}
      className={cn(
        'tw:group/toggle-group tw:flex tw:w-fit tw:flex-row tw:items-center tw:gap-[--spacing(var(--toggle-group-gap))]',
        'tw:data-[orientation=vertical]:flex-col tw:data-[orientation=vertical]:items-stretch',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, color, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

type ToggleGroupItemProps = TogglePrimitive.Props &
  Pick<ToggleProps, 'variant' | 'color' | 'size' | 'iconOnly'>;

function ToggleGroupItem({
  className,
  children,
  variant = 'flat',
  color = 'primary',
  size = 'md',
  iconOnly = false,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = context.variant ?? variant;
  const resolvedColor = context.color ?? color;
  const resolvedSize = context.size ?? size;

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-color={resolvedColor}
      data-size={resolvedSize}
      data-spacing={context.spacing}
      data-icon-only={iconOnly || undefined}
      className={cn(
        'tw:shrink-0 tw:focus-visible:z-10',
        'tw:group-data-[spacing=0]/toggle-group:rounded-none tw:group-data-[spacing=0]/toggle-group:shadow-none',
        'tw:group-data-[orientation=horizontal]/toggle-group:group-data-[spacing=0]/toggle-group:first:rounded-s-xl',
        'tw:group-data-[orientation=horizontal]/toggle-group:group-data-[spacing=0]/toggle-group:last:rounded-e-xl',
        'tw:group-data-[orientation=vertical]/toggle-group:group-data-[spacing=0]/toggle-group:first:rounded-t-xl',
        'tw:group-data-[orientation=vertical]/toggle-group:group-data-[spacing=0]/toggle-group:last:rounded-b-xl',
        'tw:group-data-[orientation=horizontal]/toggle-group:group-data-[spacing=0]/toggle-group:not-first:border-s-0',
        'tw:group-data-[orientation=vertical]/toggle-group:group-data-[spacing=0]/toggle-group:not-first:border-t-0',
        toggleVariants({
          variant: resolvedVariant,
          color: resolvedColor,
          size: resolvedSize,
          block: false,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem, type ToggleGroupItemProps, type ToggleGroupProps };
