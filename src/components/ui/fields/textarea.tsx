import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const textareaVariants = tv({
  base: 'tw:flex tw:w-full tw:resize-y tw:rounded-xl tw:border tw:bg-background tw:px-3 tw:py-2 tw:text-foreground tw:shadow-xs tw:outline-none tw:transition-[border-color,box-shadow] tw:placeholder:text-muted-foreground tw:focus-visible:ring-3 tw:aria-invalid:border-error tw:aria-invalid:ring-error/20 tw:disabled:cursor-not-allowed tw:disabled:resize-none tw:disabled:border-disabled-border tw:disabled:bg-disabled tw:disabled:text-disabled-foreground tw:motion-reduce:transition-none',
  variants: {
    color: {
      primary:
        'tw:border-primary/55 tw:caret-primary tw:focus-visible:border-primary tw:focus-visible:ring-primary/20',
      secondary:
        'tw:border-secondary/60 tw:caret-secondary tw:focus-visible:border-secondary tw:focus-visible:ring-secondary/20',
      info: 'tw:border-info/55 tw:caret-info tw:focus-visible:border-info tw:focus-visible:ring-info/20',
      success:
        'tw:border-success/55 tw:caret-success tw:focus-visible:border-success tw:focus-visible:ring-success/20',
      warning:
        'tw:border-warning/60 tw:caret-warning tw:focus-visible:border-warning tw:focus-visible:ring-warning/20',
      error:
        'tw:border-error/55 tw:caret-error tw:focus-visible:border-error tw:focus-visible:ring-error/20',
    },
    size: {
      xs: 'tw:min-h-16 tw:text-xs',
      sm: 'tw:min-h-20 tw:text-xs',
      md: 'tw:min-h-24 tw:text-sm',
      lg: 'tw:min-h-28 tw:text-sm',
      xl: 'tw:min-h-32 tw:text-base',
    },
  },
  defaultVariants: { color: 'primary', size: 'md' },
});

type TextareaProps = ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>;

function Textarea({ className, color = 'primary', size = 'md', ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="field-control"
      data-color={color}
      data-size={size}
      className={cn(textareaVariants({ color, size }), className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants, type TextareaProps };
