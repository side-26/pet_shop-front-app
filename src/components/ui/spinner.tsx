import { Loader2Icon } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const spinnerVariants = tv({
  base: 'tw:animate-spin tw:motion-reduce:animate-[spin_1.5s_linear_infinite]',
  variants: {
    color: {
      primary: 'tw:text-primary',
      secondary: 'tw:text-secondary-active',
      info: 'tw:text-info',
      success: 'tw:text-success',
      warning: 'tw:text-warning-active',
      error: 'tw:text-error',
    },
    size: {
      xs: 'tw:size-3',
      sm: 'tw:size-4',
      md: 'tw:size-5',
      lg: 'tw:size-6',
      xl: 'tw:size-8',
    },
  },
  defaultVariants: { color: 'primary', size: 'sm' },
});

type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>;

function Spinner({ className, color = 'primary', size = 'sm', ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      data-slot="spinner"
      data-color={color}
      data-size={size}
      role="status"
      aria-label="در حال بارگذاری"
      className={cn(spinnerVariants({ color, size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants, type SpinnerProps };
