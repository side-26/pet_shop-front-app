import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type FieldLabelProps = ComponentProps<'label'>;

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        'tw:flex tw:w-fit tw:items-center tw:gap-2 tw:text-label-m tw:text-foreground',
        'tw:select-none tw:has-[[data-slot=field-control]:disabled]:cursor-not-allowed',
        'tw:group-data-[disabled]/field:cursor-not-allowed tw:group-data-[invalid]/field:text-error',
        'tw:group-has-[[data-slot=field-control][data-size=xs]]/field:text-label-s tw:group-has-[[data-slot=field-control][data-size=sm]]/field:text-label-s',
        'tw:group-has-[[data-slot=field-control][data-size=md]]/field:text-label-m tw:group-has-[[data-slot=field-control][data-size=lg]]/field:text-label-l tw:group-has-[[data-slot=field-control][data-size=xl]]/field:text-label-l',
        className,
      )}
      {...props}
    />
  );
}

export { FieldLabel, type FieldLabelProps };
