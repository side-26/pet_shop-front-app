'use client';

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { tv } from 'tailwind-variants';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type CalendarSelectorItem = { value: number; label: string; disabled?: boolean };
type CalendarSelectorProps = {
  items: CalendarSelectorItem[];
  value: number | null;
  label: string;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  onValueChange: (value: number) => void;
};

const rowHeight = 36;
const padding = rowHeight * 3;

const selectorColorVariants = tv({
  slots: {
    highlight: '',
    selected: '',
  },
  variants: {
    color: {
      primary: { highlight: 'tw:text-primary/80', selected: 'tw:text-primary' },
      secondary: { highlight: 'tw:text-secondary/80', selected: 'tw:text-secondary' },
      info: { highlight: 'tw:text-info/80', selected: 'tw:text-info' },
      success: { highlight: 'tw:text-success/80', selected: 'tw:text-success' },
      warning: { highlight: 'tw:text-warning/80', selected: 'tw:text-warning' },
      error: { highlight: 'tw:text-error/80', selected: 'tw:text-error' },
    },
  },
  defaultVariants: { color: 'primary' },
});

function SelectorWheel({
  items,
  value,
  label,
  color = 'primary',
  onValueChange,
}: CalendarSelectorProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const width = label === 'سال' ? 95 : 105;
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const colors = selectorColorVariants({ color });
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 4,
    paddingStart: padding,
    paddingEnd: padding,
    initialOffset: initialIndex * rowHeight,
    initialRect: { width, height: rowHeight * 7 },
  });

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label={label}
      aria-activedescendant={items.length ? `${id}-${activeIndex}` : undefined}
      tabIndex={0}
      className="tw:h-63 tw:overflow-y-auto tw:overscroll-contain tw:outline-none tw:[scrollbar-width:thin] tw:focus-visible:ring-2 tw:focus-visible:ring-primary/25"
      onScroll={(event) => {
        setActiveIndex(
          Math.max(
            0,
            Math.min(items.length - 1, Math.round(event.currentTarget.scrollTop / rowHeight)),
          ),
        );
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const item = items[activeIndex];
          if (item && !item.disabled) onValueChange(item.value);
          return;
        }
        const target =
          event.key === 'ArrowDown'
            ? activeIndex + 1
            : event.key === 'ArrowUp'
              ? activeIndex - 1
              : event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : null;
        if (target === null) return;
        event.preventDefault();
        const next = Math.max(0, Math.min(items.length - 1, target));
        setActiveIndex(next);
        virtualizer.scrollToIndex(next, { align: 'center' });
      }}
    >
      <div className="tw:relative tw:w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index];
          const distance = Math.abs(row.index - activeIndex);
          return (
            <div
              key={item.value}
              id={`${id}-${row.index}`}
              role="option"
              aria-selected={item.value === value}
              aria-disabled={item.disabled || undefined}
              className="tw:absolute tw:top-0 tw:left-0 tw:flex tw:w-full tw:items-center tw:justify-center"
              style={{ height: rowHeight, transform: `translateY(${row.start}px)` }}
              onClick={() => {
                if (!item.disabled) onValueChange(item.value);
              }}
            >
              <span
                className={cn(
                  'tw:cursor-pointer tw:text-sm tw:transition-[transform,opacity] tw:duration-200 tw:ease-out tw:motion-reduce:transition-none',
                  (distance === 0 || item.value === value) && 'tw:font-bold',
                  item.value === value && colors.selected(),
                  item.value !== value && distance === 0 && colors.highlight(),
                  item.disabled && 'tw:cursor-not-allowed',
                )}
                style={{
                  opacity: item.disabled ? 0.25 : Math.max(0.18, 1 - distance * 0.24),
                  transform: `scale(${Math.max(0.72, 1.12 - distance * 0.12)})`,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarSelector({
  items,
  value,
  label,
  color = 'primary',
  variant = 'flat',
  disabled,
  onValueChange,
}: CalendarSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const widthClassName = label === 'سال' ? 'tw:w-[95px]' : 'tw:w-[105px]';
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            size="sm"
            variant={variant}
            color={color}
            disabled={disabled}
            aria-label={label}
            className={widthClassName}
          />
        }
      >
        {items.find((item) => item.value === value)?.label ?? label}
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={-32}
        className={cn(
          widthClassName,
          'tw:gap-1 tw:rounded-2xl tw:border-border tw:bg-background tw:p-2 tw:text-foreground tw:duration-200 tw:motion-reduce:animate-none',
        )}
      >
        <PopoverTitle className="tw:py-2 tw:text-center tw:text-label-m">{label}</PopoverTitle>
        <SelectorWheel
          items={items}
          value={value}
          label={label}
          color={color}
          onValueChange={(next) => {
            onValueChange(next);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { CalendarSelector, type CalendarSelectorProps };
