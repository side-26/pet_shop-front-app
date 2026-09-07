'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import type { Select as SelectPrimitive } from '@base-ui/react/select';
import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
} from '@/components/ui/fields/select';

/* -------------------------------------------------------------------------- */
/*                                  Constants                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_ITEM_HEIGHT = 36;
const DEFAULT_VISIBLE_ITEMS = 8;
const DEFAULT_OVERSCAN = 4;

/* -------------------------------------------------------------------------- */
/*                                    Types                                    */
/* -------------------------------------------------------------------------- */

type VirtualSelectOption<Value> = {
  label: React.ReactNode;
  value: Value;
  disabled?: boolean;
};

type VirtualSelectProps<Value, Multiple extends boolean | undefined = false> = Omit<
  SelectPrimitive.Root.Props<Value, Multiple>,
  'items'
> & {
  items: readonly VirtualSelectOption<Value>[];
};

type VirtualSelectContentProps<Value> = Omit<
  React.ComponentProps<typeof SelectContent>,
  'children'
> & {
  itemHeight?: number;
  visibleItemCount?: number;
  overscan?: number;

  renderItem?: (item: VirtualSelectOption<Value>, index: number) => React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/*                                   Context                                   */
/* -------------------------------------------------------------------------- */

type VirtualSelectContextValue = {
  items: readonly VirtualSelectOption<unknown>[];
};

const VirtualSelectContext = React.createContext<VirtualSelectContextValue | null>(null);

function useVirtualSelectContext<Value>() {
  const context = React.useContext(VirtualSelectContext);

  if (!context) {
    throw new Error('VirtualSelect components must be used inside <VirtualSelect>.');
  }

  return {
    items: context.items as readonly VirtualSelectOption<Value>[],
  };
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                     */
/* -------------------------------------------------------------------------- */

function VirtualSelect<Value, Multiple extends boolean | undefined = false>({
  items,
  itemToStringLabel,
  ...props
}: VirtualSelectProps<Value, Multiple>) {
  const itemMap = React.useMemo(() => new Map(items.map((item) => [item.value, item])), [items]);

  const getItemLabel = React.useCallback(
    (value: Value) => {
      if (itemToStringLabel) {
        return itemToStringLabel(value);
      }

      const item = itemMap.get(value);

      if (typeof item?.label === 'string') {
        return item.label;
      }

      return String(item?.value ?? value);
    },
    [itemMap, itemToStringLabel],
  );

  const contextValue = React.useMemo<VirtualSelectContextValue>(
    () => ({
      items: items as readonly VirtualSelectOption<unknown>[],
    }),
    [items],
  );

  return (
    <VirtualSelectContext.Provider value={contextValue}>
      <Select {...props} items={items} itemToStringLabel={getItemLabel} />
    </VirtualSelectContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Content                                   */
/* -------------------------------------------------------------------------- */

function VirtualSelectContent<Value>({
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleItemCount = DEFAULT_VISIBLE_ITEMS,
  overscan = DEFAULT_OVERSCAN,
  renderItem,
  ...props
}: VirtualSelectContentProps<Value>) {
  const { items } = useVirtualSelectContext<Value>();

  return (
    <SelectContent {...props}>
      <VirtualSelectList
        items={items}
        itemHeight={itemHeight}
        visibleItemCount={visibleItemCount}
        overscan={overscan}
        renderItem={
          renderItem ??
          ((item) => (
            <SelectItem
              value={item.value}
              label={typeof item.label === 'string' ? item.label : undefined}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))
        }
      />
    </SelectContent>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Virtual List                                  */
/* -------------------------------------------------------------------------- */

type VirtualSelectListProps<Value> = {
  items: readonly VirtualSelectOption<Value>[];

  itemHeight: number;

  visibleItemCount: number;

  overscan: number;

  renderItem: (item: VirtualSelectOption<Value>, index: number) => React.ReactNode;
};

function VirtualSelectList<Value>({
  items,
  itemHeight,
  visibleItemCount,
  overscan,
  renderItem,
}: VirtualSelectListProps<Value>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const safeVisibleItemCount = Math.max(1, visibleItemCount);

  const viewportHeight = safeVisibleItemCount * itemHeight;

  const getItemKey = React.useCallback(
    (index: number) => {
      const value = items[index]?.value;

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
        return value;
      }

      return index;
    },
    [items],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,

    getScrollElement: () => parentRef.current,

    estimateSize: () => itemHeight,

    overscan,

    getItemKey,

    initialRect: {
      width: 0,
      height: viewportHeight,
    },
  });

  return (
    <div
      ref={parentRef}
      data-slot="virtual-select-list"
      className="
        tw:overflow-y-auto
        tw:overscroll-contain
      "
      style={{
        maxHeight: `min(${viewportHeight}px, var(--available-height))`,
      }}
    >
      <SelectGroup
        className="
          tw:relative
          tw:w-full
        "
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              className="
                  tw:absolute
                  tw:start-0
                  tw:top-0
                  tw:w-full
                "
              style={{
                height: `${virtualItem.size}px`,

                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </SelectGroup>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Aliases                                   */
/* -------------------------------------------------------------------------- */

const VirtualSelectTrigger = SelectTrigger;

const VirtualSelectValue = SelectValue;

/* -------------------------------------------------------------------------- */
/*                                   Exports                                   */
/* -------------------------------------------------------------------------- */

export {
  VirtualSelect,
  VirtualSelectContent,
  VirtualSelectTrigger,
  VirtualSelectValue,
  type VirtualSelectContentProps,
  type VirtualSelectOption,
  type VirtualSelectProps,
  type SelectTriggerProps as VirtualSelectTriggerProps,
};
