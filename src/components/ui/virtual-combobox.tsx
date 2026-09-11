'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type * as React from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  type ComboboxProps,
} from '@/components/ui/combobox';

type VirtualComboboxOption<Value> = { label: React.ReactNode; value: Value; disabled?: boolean };
type VirtualComboboxProps<Value, Multiple extends boolean | undefined = false> = Omit<
  ComboboxProps<Value, Multiple>,
  'items'
> & { items: readonly VirtualComboboxOption<Value>[] };

const VirtualComboboxContext = createContext<{
  items: readonly VirtualComboboxOption<unknown>[];
  selectedValue: unknown;
  open: boolean;
} | null>(null);

function VirtualCombobox<Value, Multiple extends boolean | undefined = false>({
  items,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: VirtualComboboxProps<Value, Multiple>) {
  const [selectedValue, setSelectedValue] = useState<unknown>(value ?? defaultValue ?? null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const itemValues = useMemo(() => items.map((item) => item.value), [items]);
  const optionByValue = useMemo(() => new Map(items.map((item) => [item.value, item])), [items]);
  const isOpen = open ?? uncontrolledOpen;

  return (
    <VirtualComboboxContext.Provider
      value={{
        items: items as readonly VirtualComboboxOption<unknown>[],
        selectedValue: value ?? selectedValue,
        open: isOpen,
      }}
    >
      <Combobox
        items={itemValues}
        itemToStringLabel={(itemValue) => {
          const option = optionByValue.get(itemValue);
          return typeof option?.label === 'string' || typeof option?.label === 'number'
            ? String(option.label)
            : String(itemValue ?? '');
        }}
        virtualized
        value={value}
        defaultValue={defaultValue}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(nextOpen, eventDetails) => {
          setUncontrolledOpen(nextOpen);
          onOpenChange?.(nextOpen, eventDetails);
        }}
        onValueChange={(nextValue, eventDetails) => {
          setSelectedValue(nextValue);
          onValueChange?.(nextValue, eventDetails);
        }}
        {...props}
      />
    </VirtualComboboxContext.Provider>
  );
}

function VirtualComboboxContent({
  renderCount = 40,
  overscan = 10,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxContent>, 'children'> & {
  renderCount?: number;
  overscan?: number;
}) {
  const context = useContext(VirtualComboboxContext);
  if (!context) throw new Error('VirtualComboboxContent must be used within VirtualCombobox.');
  return (
    <ComboboxContent {...props}>
      <VirtualComboboxList {...context} renderCount={renderCount} overscan={overscan} />
    </ComboboxContent>
  );
}

function VirtualComboboxList({
  items,
  selectedValue,
  open,
  renderCount,
  overscan,
}: {
  items: readonly VirtualComboboxOption<unknown>[];
  selectedValue: unknown;
  open: boolean;
  renderCount: number;
  overscan: number;
}) {
  const filteredItems = ComboboxPrimitive.useFilteredItems<unknown>();
  const optionByValue = useMemo(() => new Map(items.map((item) => [item.value, item])), [items]);
  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    initialRect: { width: 0, height: Math.max(1, renderCount) * 36 },
    overscan,
    enabled: open,
  });
  useEffect(() => {
    if (!open) return;

    const valueToReveal = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
    const selectedIndex = filteredItems.findIndex((item) => Object.is(item, valueToReveal));
    if (selectedIndex < 0 || !parentRef.current) return;

    const frame = requestAnimationFrame(() => {
      virtualizer.measure();
      virtualizer.scrollToIndex(selectedIndex, { align: 'center' });
    });

    return () => cancelAnimationFrame(frame);
  }, [filteredItems, open, selectedValue, virtualizer]);
  return (
    <ComboboxList className="tw:max-h-none tw:overflow-visible tw:p-0">
      <div
        ref={parentRef}
        role="presentation"
        data-slot="virtual-combobox-list"
        className="tw:overflow-y-auto tw:overscroll-contain"
        style={{ maxHeight: `${Math.max(1, renderCount) * 36}px` }}
      >
        <div
          role="presentation"
          className="tw:relative tw:w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const itemValue = filteredItems[virtualItem.index];
            const item = optionByValue.get(itemValue);
            if (itemValue === undefined || !item) return null;

            return (
              <ComboboxItem
                key={virtualItem.key}
                index={virtualItem.index}
                value={itemValue}
                disabled={item.disabled}
                aria-setsize={filteredItems.length}
                aria-posinset={virtualItem.index + 1}
                className="tw:absolute tw:start-0 tw:top-0 tw:w-full tw:hover:bg-accent tw:hover:text-accent-foreground"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {item.label}
              </ComboboxItem>
            );
          })}
        </div>
      </div>
    </ComboboxList>
  );
}

export {
  VirtualCombobox,
  VirtualComboboxContent,
  ComboboxInput as VirtualComboboxInput,
  ComboboxTrigger as VirtualComboboxTrigger,
  type VirtualComboboxOption,
  type VirtualComboboxProps,
};
