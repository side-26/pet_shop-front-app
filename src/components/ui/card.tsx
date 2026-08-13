import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const cardVariants = tv({
  base: [
    'tw:group/card tw:flex tw:flex-col tw:gap-(--card-spacing) tw:overflow-hidden tw:rounded-3xl',
    'tw:py-(--card-spacing) tw:text-card-foreground',
    'tw:transition-[background-color,border-color,box-shadow] tw:duration-200 tw:ease-out tw:motion-reduce:transition-none',
    'tw:has-[>img:first-child]:pt-0 tw:*:[img:first-child]:rounded-t-3xl tw:*:[img:last-child]:rounded-b-3xl',
  ],
  variants: {
    variant: {
      elevated: 'tw:border tw:border-border/70 tw:bg-card tw:shadow-lg tw:shadow-foreground/5',
      filled: 'tw:border tw:border-transparent tw:bg-card tw:shadow-none',
      outlined: 'tw:border tw:border-border-strong tw:bg-card tw:shadow-none',
      glass:
        'tw:border tw:border-border/60 tw:bg-card/75 tw:shadow-xl tw:shadow-foreground/8 tw:supports-backdrop-filter:backdrop-blur-2xl',
    },
    size: {
      xs: 'tw:[--card-spacing:--spacing(3)]',
      sm: 'tw:[--card-spacing:--spacing(4)]',
      md: 'tw:[--card-spacing:--spacing(6)]',
      lg: 'tw:[--card-spacing:--spacing(8)]',
      xl: 'tw:[--card-spacing:--spacing(10)]',
    },
  },
  defaultVariants: {
    variant: 'elevated',
    size: 'md',
  },
});

type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

function Card({ className, variant = 'elevated', size = 'md', ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'tw:group/card-header tw:@container/card-header tw:grid tw:auto-rows-min tw:items-start tw:gap-1.5 tw:px-(--card-spacing)',
        'tw:has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] tw:has-data-[slot=card-description]:grid-rows-[auto_auto]',
        'tw:[.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('tw:text-title-s tw:text-card-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('tw:text-body-s tw:text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'tw:col-start-2 tw:row-span-2 tw:row-start-1 tw:self-start tw:justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('tw:px-(--card-spacing) tw:text-body-m', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:px-(--card-spacing) tw:[.border-t]:pt-(--card-spacing)',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
  type CardProps,
};
