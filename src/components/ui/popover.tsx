'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const popoverVariants = tv({
  base: 'tw:z-50 tw:flex tw:w-72 tw:origin-(--transform-origin) tw:flex-col tw:gap-4 tw:rounded-3xl tw:border tw:p-4 tw:text-sm tw:shadow-lg tw:outline-hidden tw:duration-100 tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95',
  variants: {
    variant: {
      fill: 'tw:border-transparent',
      outlined: 'tw:bg-background/95',
      tonal: 'tw:border-transparent',
    },
    color: { primary: '', secondary: '', info: '', success: '', warning: '', error: '' },
  },
  compoundVariants: [
    { color: 'primary', variant: 'fill', class: 'tw:bg-primary tw:text-primary-foreground' },
    { color: 'secondary', variant: 'fill', class: 'tw:bg-secondary tw:text-secondary-foreground' },
    { color: 'info', variant: 'fill', class: 'tw:bg-info tw:text-info-foreground' },
    { color: 'success', variant: 'fill', class: 'tw:bg-success tw:text-success-foreground' },
    { color: 'warning', variant: 'fill', class: 'tw:bg-warning tw:text-warning-foreground' },
    { color: 'error', variant: 'fill', class: 'tw:bg-error tw:text-error-foreground' },
    { color: 'primary', variant: 'outlined', class: 'tw:border-primary tw:text-primary' },
    {
      color: 'secondary',
      variant: 'outlined',
      class: 'tw:border-secondary tw:text-secondary-active',
    },
    { color: 'info', variant: 'outlined', class: 'tw:border-info tw:text-info' },
    { color: 'success', variant: 'outlined', class: 'tw:border-success tw:text-success' },
    { color: 'warning', variant: 'outlined', class: 'tw:border-warning tw:text-warning-active' },
    { color: 'error', variant: 'outlined', class: 'tw:border-error tw:text-error' },
    {
      color: 'primary',
      variant: 'tonal',
      class: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
    },
    {
      color: 'secondary',
      variant: 'tonal',
      class: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
    },
    { color: 'info', variant: 'tonal', class: 'tw:bg-info-muted tw:text-info-muted-foreground' },
    {
      color: 'success',
      variant: 'tonal',
      class: 'tw:bg-success-muted tw:text-success-muted-foreground',
    },
    {
      color: 'warning',
      variant: 'tonal',
      class: 'tw:bg-warning-muted tw:text-warning-muted-foreground',
    },
    { color: 'error', variant: 'tonal', class: 'tw:bg-error-muted tw:text-error-muted-foreground' },
  ],
  defaultVariants: { variant: 'outlined', color: 'primary' },
});

type PopoverContentProps = PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> &
  VariantProps<typeof popoverVariants>;

function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}
function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 8,
  variant = 'outlined',
  color = 'primary',
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="tw:isolate tw:z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-variant={variant}
          data-color={color}
          className={cn(popoverVariants({ variant, color }), className)}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('tw:flex tw:flex-col tw:gap-1 tw:text-sm', className)}
      {...props}
    />
  );
}
function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn('tw:text-base tw:font-medium tw:text-current', className)}
      {...props}
    />
  );
}
function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('tw:text-current tw:opacity-75', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  popoverVariants,
  type PopoverContentProps,
};
