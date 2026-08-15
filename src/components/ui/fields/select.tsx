'use client';

import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Select<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="field-control"
      className={cn(
        'tw:flex tw:h-10 tw:w-full tw:items-center tw:justify-between tw:gap-2 tw:rounded-xl tw:border tw:border-input tw:bg-background tw:px-3 tw:text-body-m tw:text-foreground tw:shadow-xs tw:outline-none tw:transition-[border-color,box-shadow] tw:data-placeholder:text-muted-foreground tw:focus-visible:border-primary tw:focus-visible:ring-3 tw:focus-visible:ring-primary/20 tw:aria-invalid:border-error tw:aria-invalid:ring-error/20 tw:disabled:cursor-not-allowed tw:disabled:border-disabled-border tw:disabled:bg-disabled tw:disabled:text-disabled-foreground tw:[&_svg]:size-4 tw:motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'align' | 'alignItemWithTrigger' | 'side' | 'sideOffset'>;

function SelectContent({
  className,
  children,
  align = 'start',
  alignItemWithTrigger = false,
  side = 'bottom',
  sideOffset = 6,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        side={side}
        sideOffset={sideOffset}
        className="tw:isolate tw:z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'tw:min-w-(--anchor-width) tw:origin-(--transform-origin) tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border/60 tw:bg-popover/95 tw:p-1 tw:text-popover-foreground tw:shadow-lg tw:outline-none tw:supports-backdrop-filter:backdrop-blur-xl tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95 tw:motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.ScrollUpArrow className="tw:flex tw:h-6 tw:items-center tw:justify-center">
            <ChevronUpIcon aria-hidden="true" className="tw:size-4" />
          </SelectPrimitive.ScrollUpArrow>
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow className="tw:flex tw:h-6 tw:items-center tw:justify-center">
            <ChevronDownIcon aria-hidden="true" className="tw:size-4" />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}
function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('tw:px-2 tw:py-1.5 tw:text-label-s tw:text-muted-foreground', className)}
      {...props}
    />
  );
}
function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'tw:relative tw:flex tw:min-h-9 tw:cursor-default tw:items-center tw:rounded-xl tw:py-2 tw:ps-8 tw:pe-2 tw:text-body-m tw:outline-none tw:select-none tw:data-highlighted:bg-accent tw:data-highlighted:text-accent-foreground tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="tw:absolute tw:start-2 tw:flex tw:size-4 tw:items-center tw:justify-center">
        <CheckIcon aria-hidden="true" className="tw:size-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn('tw:-mx-1 tw:my-1 tw:h-px tw:bg-border', className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
