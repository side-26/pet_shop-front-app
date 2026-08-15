import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type FieldProps = ComponentProps<'div'>;

function Field({ className, ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      className={cn(
        'tw:group/field tw:flex tw:w-full tw:flex-col tw:gap-2',
        'tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

export { Field, type FieldProps };
