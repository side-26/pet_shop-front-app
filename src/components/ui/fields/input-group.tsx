import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

function InputGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'tw:group/input-group tw:flex tw:h-10 tw:w-full tw:items-center tw:overflow-hidden tw:rounded-xl tw:border tw:border-input tw:bg-background tw:shadow-xs tw:transition-[border-color,box-shadow] tw:focus-within:border-primary tw:focus-within:ring-3 tw:focus-within:ring-primary/20 tw:has-[[aria-invalid=true]]:border-error tw:has-[[aria-invalid=true]]:ring-error/20',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="field-control"
      className={cn(
        'tw:min-w-0 tw:flex-1 tw:self-stretch tw:bg-transparent tw:px-3 tw:text-body-m tw:text-foreground tw:outline-none tw:placeholder:text-muted-foreground tw:disabled:cursor-not-allowed tw:disabled:text-disabled-foreground',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        'tw:flex tw:h-full tw:shrink-0 tw:items-center tw:gap-2 tw:px-3 tw:text-label-m tw:text-muted-foreground tw:[&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
