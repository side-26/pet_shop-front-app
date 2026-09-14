import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FieldErrorHintProps = Omit<ComponentProps<'span'>, 'children' | 'role'> & {
  error?: ReactNode;
  hint?: ReactNode;
  invalid?: boolean;
  textClassName?: string;
};

/**
 * Persistent field feedback region. Validation feedback takes precedence over
 * hint text while retaining the same element and id for `aria-describedby`.
 */
function FieldErrorHint({
  className,
  error,
  hint,
  invalid = false,
  textClassName,
  ...props
}: FieldErrorHintProps) {
  return (
    <span role={invalid ? 'alert' : undefined} className={className} {...props}>
      <span className={cn(invalid ? 'tw:text-error' : textClassName)}>{error ?? hint}</span>
    </span>
  );
}

export { FieldErrorHint, type FieldErrorHintProps };
