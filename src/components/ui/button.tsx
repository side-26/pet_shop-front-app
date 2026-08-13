import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const buttonVariants = tv({
  base: [
    'tw:group/button tw:inline-flex tw:shrink-0 tw:items-center tw:justify-center',
    'tw:rounded-xl tw:border tw:border-transparent tw:bg-clip-padding tw:font-medium tw:whitespace-nowrap',
    'tw:shadow-sm tw:outline-none tw:select-none',
    'tw:transition-[background-color,border-color,color,box-shadow,transform] tw:duration-150 tw:ease-out',
    'tw:hover:shadow-md tw:active:not-aria-[haspopup]:translate-y-px tw:active:shadow-sm',
    'tw:focus-visible:ring-3',
    'tw:disabled:pointer-events-none tw:disabled:border-disabled-border tw:disabled:bg-disabled tw:disabled:text-disabled-foreground tw:disabled:shadow-none',
    'tw:aria-busy:pointer-events-none tw:aria-invalid:border-error tw:aria-invalid:ring-error/25',
    'tw:data-[icon-only=true]:aspect-square tw:data-[icon-only=true]:px-0',
    'tw:motion-reduce:transition-none tw:motion-reduce:active:transform-none',
    'tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      fill: '',
      outlined: 'tw:bg-background/80 tw:shadow-none',
      tonal: 'tw:border-transparent tw:shadow-none',
      flat: 'tw:border-transparent tw:bg-transparent tw:shadow-none',
      text: 'tw:border-transparent tw:bg-transparent tw:shadow-none tw:underline-offset-4 tw:hover:underline',
      transparent:
        'tw:bg-background/45 tw:shadow-none tw:supports-backdrop-filter:backdrop-blur-xl tw:hover:bg-background/70',
    },
    color: {
      primary: 'tw:focus-visible:border-primary tw:focus-visible:ring-primary/25',
      secondary: 'tw:focus-visible:border-secondary tw:focus-visible:ring-secondary/25',
      info: 'tw:focus-visible:border-info tw:focus-visible:ring-info/25',
      success: 'tw:focus-visible:border-success tw:focus-visible:ring-success/25',
      warning: 'tw:focus-visible:border-warning tw:focus-visible:ring-warning/25',
      error: 'tw:focus-visible:border-error tw:focus-visible:ring-error/25',
    },
    size: {
      xs: 'tw:h-7 tw:gap-1 tw:px-2.5 tw:text-label-s tw:[&_svg:not([class*=size-])]:size-3',
      sm: 'tw:h-8 tw:gap-1.5 tw:px-3 tw:text-label-m tw:[&_svg:not([class*=size-])]:size-3.5',
      md: 'tw:h-10 tw:gap-2 tw:px-4 tw:text-label-m tw:[&_svg:not([class*=size-])]:size-4',
      lg: 'tw:h-11 tw:gap-2 tw:px-5 tw:text-label-l tw:[&_svg:not([class*=size-])]:size-4.5',
      xl: 'tw:h-12 tw:gap-2.5 tw:px-6 tw:text-label-l tw:[&_svg:not([class*=size-])]:size-5',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'fill',
      class:
        'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary-hover tw:active:bg-primary-active',
    },
    {
      color: 'secondary',
      variant: 'fill',
      class:
        'tw:bg-secondary tw:text-secondary-foreground tw:hover:bg-secondary-hover tw:active:bg-secondary-active',
    },
    {
      color: 'info',
      variant: 'fill',
      class: 'tw:bg-info tw:text-info-foreground tw:hover:bg-info-hover tw:active:bg-info-active',
    },
    {
      color: 'success',
      variant: 'fill',
      class:
        'tw:bg-success tw:text-success-foreground tw:hover:bg-success-hover tw:active:bg-success-active',
    },
    {
      color: 'warning',
      variant: 'fill',
      class:
        'tw:bg-warning tw:text-warning-foreground tw:hover:bg-warning-hover tw:active:bg-warning-active',
    },
    {
      color: 'error',
      variant: 'fill',
      class:
        'tw:bg-error tw:text-error-foreground tw:hover:bg-error-hover tw:active:bg-error-active',
    },

    {
      color: 'primary',
      variant: 'outlined',
      class:
        'tw:border-primary tw:text-primary tw:hover:bg-primary-muted tw:active:bg-primary-muted',
    },
    {
      color: 'secondary',
      variant: 'outlined',
      class:
        'tw:border-secondary tw:text-secondary-active tw:hover:bg-secondary-muted tw:active:bg-secondary-muted',
    },
    {
      color: 'info',
      variant: 'outlined',
      class: 'tw:border-info tw:text-info tw:hover:bg-info-muted tw:active:bg-info-muted',
    },
    {
      color: 'success',
      variant: 'outlined',
      class:
        'tw:border-success tw:text-success tw:hover:bg-success-muted tw:active:bg-success-muted',
    },
    {
      color: 'warning',
      variant: 'outlined',
      class:
        'tw:border-warning tw:text-warning-active tw:hover:bg-warning-muted tw:active:bg-warning-muted',
    },
    {
      color: 'error',
      variant: 'outlined',
      class: 'tw:border-error tw:text-error tw:hover:bg-error-muted tw:active:bg-error-muted',
    },

    {
      color: 'primary',
      variant: 'tonal',
      class:
        'tw:bg-primary-muted tw:text-primary-muted-foreground tw:hover:bg-primary-muted/80 tw:active:bg-primary-muted',
    },
    {
      color: 'secondary',
      variant: 'tonal',
      class:
        'tw:bg-secondary-muted tw:text-secondary-muted-foreground tw:hover:bg-secondary-muted/80 tw:active:bg-secondary-muted',
    },
    {
      color: 'info',
      variant: 'tonal',
      class:
        'tw:bg-info-muted tw:text-info-muted-foreground tw:hover:bg-info-muted/80 tw:active:bg-info-muted',
    },
    {
      color: 'success',
      variant: 'tonal',
      class:
        'tw:bg-success-muted tw:text-success-muted-foreground tw:hover:bg-success-muted/80 tw:active:bg-success-muted',
    },
    {
      color: 'warning',
      variant: 'tonal',
      class:
        'tw:bg-warning-muted tw:text-warning-muted-foreground tw:hover:bg-warning-muted/80 tw:active:bg-warning-muted',
    },
    {
      color: 'error',
      variant: 'tonal',
      class:
        'tw:bg-error-muted tw:text-error-muted-foreground tw:hover:bg-error-muted/80 tw:active:bg-error-muted',
    },

    {
      color: 'primary',
      variant: ['flat', 'text'],
      class: 'tw:text-primary tw:hover:bg-primary-muted tw:active:bg-primary-muted',
    },
    {
      color: 'secondary',
      variant: ['flat', 'text'],
      class: 'tw:text-secondary-active tw:hover:bg-secondary-muted tw:active:bg-secondary-muted',
    },
    {
      color: 'info',
      variant: ['flat', 'text'],
      class: 'tw:text-info tw:hover:bg-info-muted tw:active:bg-info-muted',
    },
    {
      color: 'success',
      variant: ['flat', 'text'],
      class: 'tw:text-success tw:hover:bg-success-muted tw:active:bg-success-muted',
    },
    {
      color: 'warning',
      variant: ['flat', 'text'],
      class: 'tw:text-warning-active tw:hover:bg-warning-muted tw:active:bg-warning-muted',
    },
    {
      color: 'error',
      variant: ['flat', 'text'],
      class: 'tw:text-error tw:hover:bg-error-muted tw:active:bg-error-muted',
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

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    iconOnly?: boolean;
  };

function Button({
  className,
  variant = 'fill',
  color = 'primary',
  size = 'md',
  iconOnly = false,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={cn(buttonVariants({ variant, color, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
