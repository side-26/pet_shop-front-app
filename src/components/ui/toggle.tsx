'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { tv, type VariantProps } from 'tailwind-variants';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const toggleVariants = tv({
  extend: buttonVariants,
  base: [
    'tw:group/toggle tw:data-pressed:ring-2 tw:data-pressed:ring-offset-1',
    'tw:data-pressed:shadow-sm tw:data-[icon-only=true]:aspect-square tw:data-[icon-only=true]:px-0',
  ],
  compoundVariants: [
    { color: 'primary', class: 'tw:data-pressed:ring-primary/25' },
    { color: 'secondary', class: 'tw:data-pressed:ring-secondary/25' },
    { color: 'info', class: 'tw:data-pressed:ring-info/25' },
    { color: 'success', class: 'tw:data-pressed:ring-success/25' },
    { color: 'warning', class: 'tw:data-pressed:ring-warning/25' },
    { color: 'error', class: 'tw:data-pressed:ring-error/25' },
  ],
  defaultVariants: {
    variant: 'outlined',
    color: 'primary',
    size: 'md',
    block: false,
  },
});

type ToggleProps = TogglePrimitive.Props &
  Omit<VariantProps<typeof toggleVariants>, 'block'> & {
    iconOnly?: boolean;
  };

function Toggle({
  className,
  variant = 'outlined',
  color = 'primary',
  size = 'md',
  iconOnly = false,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={cn(toggleVariants({ variant, color, size, block: false }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants, type ToggleProps };
