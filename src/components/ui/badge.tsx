import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const badgeVariants = tv({
  base: [
    'tw:group/badge tw:inline-flex tw:w-fit tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden',
    'tw:rounded-full tw:border tw:border-transparent tw:font-medium tw:whitespace-nowrap',
    'tw:transition-[background-color,border-color,color,box-shadow] tw:duration-150',
    'tw:focus-visible:outline-none tw:focus-visible:ring-3',
    'tw:aria-invalid:border-error tw:aria-invalid:ring-error/25 tw:motion-reduce:transition-none',
    'tw:[&>svg]:pointer-events-none tw:[&>svg]:shrink-0',
  ],
  variants: {
    variant: {
      fill: '',
      outlined: 'tw:bg-transparent',
      tonal: 'tw:border-transparent',
      flat: 'tw:border-transparent tw:bg-transparent',
      text: 'tw:border-transparent tw:bg-transparent tw:underline-offset-4 tw:[a]:hover:underline',
      transparent:
        'tw:bg-background/45 tw:supports-backdrop-filter:backdrop-blur-xl tw:[a]:hover:bg-background/70',
    },
    color: {
      neutral: 'tw:focus-visible:border-foreground tw:focus-visible:ring-foreground/20',
      primary: 'tw:focus-visible:border-primary tw:focus-visible:ring-primary/25',
      secondary: 'tw:focus-visible:border-secondary tw:focus-visible:ring-secondary/25',
      info: 'tw:focus-visible:border-info tw:focus-visible:ring-info/25',
      success: 'tw:focus-visible:border-success tw:focus-visible:ring-success/25',
      warning: 'tw:focus-visible:border-warning tw:focus-visible:ring-warning/25',
      error: 'tw:focus-visible:border-error tw:focus-visible:ring-error/25',
    },
    size: {
      xs: 'tw:h-4 tw:gap-0.5 tw:px-1.5 tw:text-[0.625rem] tw:[&>svg]:size-2.5',
      sm: 'tw:h-5 tw:gap-1 tw:px-2 tw:text-label-s tw:[&>svg]:size-3',
      md: 'tw:h-6 tw:gap-1 tw:px-2.5 tw:text-label-s tw:[&>svg]:size-3.5',
      lg: 'tw:h-7 tw:gap-1.5 tw:px-3 tw:text-label-m tw:[&>svg]:size-4',
      xl: 'tw:h-8 tw:gap-1.5 tw:px-3.5 tw:text-label-m tw:[&>svg]:size-4',
    },
  },
  compoundVariants: [
    {
      color: 'neutral',
      variant: 'fill',
      class: 'tw:bg-foreground tw:text-background tw:[a]:hover:bg-foreground/85',
    },
    {
      color: 'neutral',
      variant: 'outlined',
      class: 'tw:border-border-strong tw:text-foreground tw:[a]:hover:bg-muted',
    },
    {
      color: 'neutral',
      variant: 'tonal',
      class: 'tw:bg-muted tw:text-muted-foreground tw:[a]:hover:bg-muted-hover',
    },
    {
      color: 'neutral',
      variant: ['flat', 'text'],
      class: 'tw:text-muted-foreground tw:[a]:hover:bg-muted',
    },
    {
      color: 'neutral',
      variant: 'transparent',
      class: 'tw:border-border tw:text-foreground',
    },
    {
      color: 'primary',
      variant: 'fill',
      class: 'tw:bg-primary tw:text-primary-foreground tw:[a]:hover:bg-primary-hover',
    },
    {
      color: 'secondary',
      variant: 'fill',
      class: 'tw:bg-secondary tw:text-secondary-foreground tw:[a]:hover:bg-secondary-hover',
    },
    {
      color: 'info',
      variant: 'fill',
      class: 'tw:bg-info tw:text-info-foreground tw:[a]:hover:bg-info-hover',
    },
    {
      color: 'success',
      variant: 'fill',
      class: 'tw:bg-success tw:text-success-foreground tw:[a]:hover:bg-success-hover',
    },
    {
      color: 'warning',
      variant: 'fill',
      class: 'tw:bg-warning tw:text-warning-foreground tw:[a]:hover:bg-warning-hover',
    },
    {
      color: 'error',
      variant: 'fill',
      class: 'tw:bg-error tw:text-error-foreground tw:[a]:hover:bg-error-hover',
    },

    {
      color: 'primary',
      variant: 'outlined',
      class: 'tw:border-primary tw:text-primary tw:[a]:hover:bg-primary-muted',
    },
    {
      color: 'secondary',
      variant: 'outlined',
      class: 'tw:border-secondary tw:text-secondary-active tw:[a]:hover:bg-secondary-muted',
    },
    {
      color: 'info',
      variant: 'outlined',
      class: 'tw:border-info tw:text-info tw:[a]:hover:bg-info-muted',
    },
    {
      color: 'success',
      variant: 'outlined',
      class: 'tw:border-success tw:text-success tw:[a]:hover:bg-success-muted',
    },
    {
      color: 'warning',
      variant: 'outlined',
      class: 'tw:border-warning tw:text-warning-active tw:[a]:hover:bg-warning-muted',
    },
    {
      color: 'error',
      variant: 'outlined',
      class: 'tw:border-error tw:text-error tw:[a]:hover:bg-error-muted',
    },

    {
      color: 'primary',
      variant: 'tonal',
      class:
        'tw:bg-primary-muted tw:text-primary-muted-foreground tw:[a]:hover:bg-primary-muted/80',
    },
    {
      color: 'secondary',
      variant: 'tonal',
      class:
        'tw:bg-secondary-muted tw:text-secondary-muted-foreground tw:[a]:hover:bg-secondary-muted/80',
    },
    {
      color: 'info',
      variant: 'tonal',
      class: 'tw:bg-info-muted tw:text-info-muted-foreground tw:[a]:hover:bg-info-muted/80',
    },
    {
      color: 'success',
      variant: 'tonal',
      class:
        'tw:bg-success-muted tw:text-success-muted-foreground tw:[a]:hover:bg-success-muted/80',
    },
    {
      color: 'warning',
      variant: 'tonal',
      class:
        'tw:bg-warning-muted tw:text-warning-muted-foreground tw:[a]:hover:bg-warning-muted/80',
    },
    {
      color: 'error',
      variant: 'tonal',
      class: 'tw:bg-error-muted tw:text-error-muted-foreground tw:[a]:hover:bg-error-muted/80',
    },

    {
      color: 'primary',
      variant: ['flat', 'text'],
      class: 'tw:text-primary tw:[a]:hover:bg-primary-muted',
    },
    {
      color: 'secondary',
      variant: ['flat', 'text'],
      class: 'tw:text-secondary-active tw:[a]:hover:bg-secondary-muted',
    },
    { color: 'info', variant: ['flat', 'text'], class: 'tw:text-info tw:[a]:hover:bg-info-muted' },
    {
      color: 'success',
      variant: ['flat', 'text'],
      class: 'tw:text-success tw:[a]:hover:bg-success-muted',
    },
    {
      color: 'warning',
      variant: ['flat', 'text'],
      class: 'tw:text-warning-active tw:[a]:hover:bg-warning-muted',
    },
    {
      color: 'error',
      variant: ['flat', 'text'],
      class: 'tw:text-error tw:[a]:hover:bg-error-muted',
    },

    { color: 'primary', variant: 'transparent', class: 'tw:border-primary/40 tw:text-primary' },
    {
      color: 'secondary',
      variant: 'transparent',
      class: 'tw:border-secondary/50 tw:text-secondary-active',
    },
    { color: 'info', variant: 'transparent', class: 'tw:border-info/40 tw:text-info' },
    { color: 'success', variant: 'transparent', class: 'tw:border-success/40 tw:text-success' },
    {
      color: 'warning',
      variant: 'transparent',
      class: 'tw:border-warning/50 tw:text-warning-active',
    },
    { color: 'error', variant: 'transparent', class: 'tw:border-error/40 tw:text-error' },
  ],
  defaultVariants: {
    variant: 'fill',
    color: 'primary',
    size: 'md',
  },
});

type BadgeProps = useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = 'fill',
  color = 'primary',
  size = 'md',
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant, color, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
      color,
      size,
    },
  });
}

export { Badge, badgeVariants, type BadgeProps };
