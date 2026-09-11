'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { createContext, useCallback, useContext } from 'react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

type ComboboxColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
type ComboboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ComboboxContextValue = { color: ComboboxColor; size: ComboboxSize };

const ComboboxContext = createContext<ComboboxContextValue>({ color: 'primary', size: 'md' });

const sizeClasses: Record<ComboboxSize, string> = {
  xs: 'tw:h-7 tw:px-2.5 tw:text-label-s',
  sm: 'tw:h-8 tw:px-3 tw:text-label-m',
  md: 'tw:h-10 tw:px-3 tw:text-body-m',
  lg: 'tw:h-11 tw:px-4 tw:text-body-m',
  xl: 'tw:h-12 tw:px-4 tw:text-body-l',
};

const colorClasses: Record<ComboboxColor, string> = {
  primary: 'tw:focus-within:border-primary tw:focus-within:ring-primary/20',
  secondary: 'tw:focus-within:border-secondary tw:focus-within:ring-secondary/20',
  info: 'tw:focus-within:border-info tw:focus-within:ring-info/20',
  success: 'tw:focus-within:border-success tw:focus-within:ring-success/20',
  warning: 'tw:focus-within:border-warning tw:focus-within:ring-warning/20',
  error: 'tw:focus-within:border-error tw:focus-within:ring-error/20',
};

type ComboboxProps<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple> & { color?: ComboboxColor; size?: ComboboxSize };

function Combobox<Value, Multiple extends boolean | undefined = false>({
  color = 'primary',
  size = 'md',
  items,
  itemToStringLabel,
  ...props
}: ComboboxProps<Value, Multiple>) {
  const resolveItemLabel = useCallback(
    (value: Value) => {
      if (itemToStringLabel) return itemToStringLabel(value);

      if (value && typeof value === 'object' && 'label' in value) {
        return String(value.label ?? '');
      }

      if (Array.isArray(items)) {
        const flatItems = items.flatMap((item) =>
          item && typeof item === 'object' && 'items' in item ? item.items : item,
        );
        const match = flatItems.find(
          (item) => item && typeof item === 'object' && 'value' in item && item.value === value,
        );
        if (match?.label != null) return String(match.label);
      } else if (items && Object.prototype.hasOwnProperty.call(items, String(value))) {
        return String((items as unknown as Record<string, React.ReactNode>)[String(value)]);
      }

      return String(value ?? '');
    },
    [itemToStringLabel, items],
  );

  return (
    <ComboboxContext.Provider value={{ color, size }}>
      <ComboboxPrimitive.Root
        items={items}
        itemToStringLabel={items ? resolveItemLabel : itemToStringLabel}
        {...props}
      />
    </ComboboxContext.Provider>
  );
}

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  const { color, size } = useContext(ComboboxContext);
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      render={<input />}
      className={cn(
        'tw:w-full tw:rounded-xl tw:border tw:border-input tw:bg-background tw:text-foreground tw:shadow-xs tw:outline-none tw:transition-[border-color,box-shadow] tw:focus-visible:ring-3 tw:disabled:cursor-not-allowed tw:disabled:border-disabled-border tw:disabled:bg-disabled tw:disabled:text-disabled-foreground tw:placeholder:text-muted-foreground',
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      {...props}
    />
  );
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        'tw:absolute tw:end-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <ChevronDownIcon aria-hidden />}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, 'side' | 'sideOffset'>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        className="tw:isolate tw:z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            'tw:max-h-(--available-height) tw:w-(--anchor-width) tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border/60 tw:bg-popover/95 tw:p-1 tw:text-popover-foreground tw:shadow-lg tw:backdrop-blur-xl tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-closed:animate-out tw:data-closed:fade-out-0',
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn('tw:max-h-72 tw:overflow-y-auto tw:p-1', className)}
      {...props}
    />
  );
}
function ComboboxGroup(props: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}
function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}
function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        'tw:hidden tw:justify-center tw:p-3 tw:text-body-m tw:text-muted-foreground tw:group-data-empty/combobox-content:flex',
        className,
      )}
      {...props}
    />
  );
}
function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        'tw:relative tw:flex tw:min-h-9 tw:cursor-default tw:items-center tw:rounded-xl tw:py-2 tw:ps-8 tw:pe-3 tw:text-body-m tw:outline-none tw:data-highlighted:bg-accent tw:data-highlighted:text-accent-foreground tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="tw:absolute tw:start-2">
        <CheckIcon aria-hidden />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}
function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />;
}

export {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxColor,
  type ComboboxProps,
  type ComboboxSize,
};
