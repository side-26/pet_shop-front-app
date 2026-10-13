import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const itemVariants = tv({
  base: [
    'tw:group/item tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:px-2 tw:py-2',
    'tw:transition-[background-color,border-color,color,box-shadow] tw:duration-150 tw:ease-out',
    'tw:focus-visible:outline-none tw:focus-visible:ring-3 tw:motion-reduce:transition-none',
  ],
  variants: {
    variant: {
      default: 'tw:border tw:border-transparent',
      tonal: 'tw:border tw:border-transparent',
      fill: 'tw:border tw:border-transparent',
      glassy:
        'tw:border tw:bg-card/75 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl',
    },
    color: {
      primary: 'tw:focus-visible:border-primary tw:focus-visible:ring-primary/25',
      secondary: 'tw:focus-visible:border-secondary tw:focus-visible:ring-secondary/25',
      foreground: 'tw:focus-visible:border-foreground tw:focus-visible:ring-foreground/20',
      success: 'tw:focus-visible:border-success tw:focus-visible:ring-success/25',
      error: 'tw:focus-visible:border-error tw:focus-visible:ring-error/25',
    },
  },
  compoundVariants: [
    { variant: 'default', color: 'primary', class: 'tw:text-primary tw:hover:bg-primary-muted' },
    {
      variant: 'default',
      color: 'secondary',
      class: 'tw:text-secondary-active tw:hover:bg-secondary-muted',
    },
    { variant: 'default', color: 'foreground', class: 'tw:text-foreground tw:hover:bg-muted' },
    { variant: 'default', color: 'success', class: 'tw:text-success tw:hover:bg-success-muted' },
    { variant: 'default', color: 'error', class: 'tw:text-error tw:hover:bg-error-muted' },
    {
      variant: 'tonal',
      color: 'primary',
      class: 'tw:bg-primary-muted tw:text-primary-muted-foreground tw:hover:bg-primary-muted/80',
    },
    {
      variant: 'tonal',
      color: 'secondary',
      class:
        'tw:bg-secondary-muted tw:text-secondary-muted-foreground tw:hover:bg-secondary-muted/80',
    },
    {
      variant: 'tonal',
      color: 'foreground',
      class: 'tw:bg-muted tw:text-foreground tw:hover:bg-muted-hover',
    },
    {
      variant: 'tonal',
      color: 'success',
      class: 'tw:bg-success-muted tw:text-success-muted-foreground tw:hover:bg-success-muted/80',
    },
    {
      variant: 'tonal',
      color: 'error',
      class: 'tw:bg-error-muted tw:text-error-muted-foreground tw:hover:bg-error-muted/80',
    },
    {
      variant: 'fill',
      color: 'primary',
      class: 'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary-hover',
    },
    {
      variant: 'fill',
      color: 'secondary',
      class: 'tw:bg-secondary tw:text-secondary-foreground tw:hover:bg-secondary-hover',
    },
    {
      variant: 'fill',
      color: 'foreground',
      class: 'tw:bg-foreground tw:text-background tw:hover:bg-foreground/85',
    },
    {
      variant: 'fill',
      color: 'success',
      class: 'tw:bg-success tw:text-success-foreground tw:hover:bg-success-hover',
    },
    {
      variant: 'fill',
      color: 'error',
      class: 'tw:bg-error tw:text-error-foreground tw:hover:bg-error-hover',
    },
    {
      variant: 'glassy',
      color: 'primary',
      class: 'tw:border-primary/40 tw:text-primary tw:hover:bg-primary-muted/80',
    },
    {
      variant: 'glassy',
      color: 'secondary',
      class: 'tw:border-secondary/50 tw:text-secondary-active tw:hover:bg-secondary-muted/80',
    },
    {
      variant: 'glassy',
      color: 'foreground',
      class: 'tw:border-border tw:text-foreground tw:hover:bg-muted/80',
    },
    {
      variant: 'glassy',
      color: 'success',
      class: 'tw:border-success/40 tw:text-success tw:hover:bg-success-muted/80',
    },
    {
      variant: 'glassy',
      color: 'error',
      class: 'tw:border-error/40 tw:text-error tw:hover:bg-error-muted/80',
    },
  ],
  defaultVariants: {
    variant: 'default',
    color: 'foreground',
  },
});

type ItemProps = useRender.ComponentProps<'div'> & VariantProps<typeof itemVariants>;

function Item({
  className,
  variant = 'default',
  color = 'foreground',
  render,
  ...props
}: ItemProps) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>({ className: cn(itemVariants({ variant, color }), className) }, props),
    render,
    state: { slot: 'item', variant, color },
  });
}

function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-media" className={cn('tw:shrink-0', className)} {...props} />;
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="item-content" className={cn('tw:min-w-0 tw:flex-1', className)} {...props} />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 data-slot="item-title" className={cn('tw:truncate tw:text-body-m', className)} {...props} />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-actions" className={cn('tw:shrink-0', className)} {...props} />;
}

function ItemGroup({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="item-group" className={cn('tw:flex tw:flex-col', className)} {...props} />;
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  itemVariants,
  type ItemProps,
};
