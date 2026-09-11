'use client';

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type * as React from 'react';
import { DayPicker } from '@daypicker/persian';
import {
  getDefaultClassNames,
  labelDayButton,
  labelGridcell,
  type DropdownProps,
  type Matcher,
  type OnSelectHandler,
  type PropsSingle,
} from 'react-day-picker';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { CalendarSelector } from '@/components/ui/calendar-selector';

const calendarStartMonth = new Date(1920, 0, 1);
const calendarEndMonth = new Date(2277, 11, 31);
const prerenderDate = new Date(2026, 0, 1);
const fridayHolidayMatcher: Matcher = { dayOfWeek: [5] };
const defaultClassNames = getDefaultClassNames();

function CalendarDropdown({
  options = [],
  value,
  onChange,
  disabled,
  name,
  'aria-label': ariaLabel,
  color,
}: DropdownProps & { color: Exclude<CalendarColor, 'neutral'> }) {
  const selectedValue =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : null;

  return (
    <CalendarSelector
      items={options}
      value={selectedValue}
      disabled={disabled}
      label={
        name?.includes('year') || ariaLabel?.includes('Year') || ariaLabel?.includes('سال')
          ? 'سال'
          : 'ماه'
      }
      color={color}
      onValueChange={(nextValue) => {
        onChange?.({
          target: { value: String(nextValue) },
        } as ChangeEvent<HTMLSelectElement>);
      }}
    />
  );
}

function normalizeMatchers(matcher: Matcher | Matcher[] | undefined): Matcher[] {
  if (matcher === undefined) return [];
  return Array.isArray(matcher) ? matcher : [matcher];
}

const calendarColorVariants = tv({
  slots: {
    dropdown: '',
    dayButton: '',
    selected: '',
    today: '',
    rangeMiddle: '',
    rangeStart: '',
    rangeEnd: '',
  },
  variants: {
    color: {
      primary: {
        dropdown: 'tw:focus-visible:border-primary tw:focus-visible:ring-primary/25',
        dayButton:
          'tw:hover:bg-primary/50 tw:focus-visible:ring-primary/25 tw:aria-selected:bg-primary tw:aria-selected:text-primary-foreground',
        selected: 'tw:bg-primary tw:text-primary-foreground',
        today: 'tw:text-primary',
        rangeMiddle: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
        rangeStart: 'tw:bg-primary tw:text-primary-foreground',
        rangeEnd: 'tw:bg-primary tw:text-primary-foreground',
      },
      secondary: {
        dropdown: 'tw:focus-visible:border-secondary tw:focus-visible:ring-secondary/25',
        dayButton:
          'tw:hover:bg-secondary/50 tw:focus-visible:ring-secondary/25 tw:aria-selected:bg-secondary tw:aria-selected:text-secondary-foreground',
        selected: 'tw:bg-secondary tw:text-secondary-foreground',
        today: 'tw:text-secondary-active',
        rangeMiddle: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
        rangeStart: 'tw:bg-secondary tw:text-secondary-foreground',
        rangeEnd: 'tw:bg-secondary tw:text-secondary-foreground',
      },
      neutral: {
        dropdown: 'tw:focus-visible:border-foreground tw:focus-visible:ring-foreground/20',
        dayButton:
          'tw:hover:bg-foreground/50 tw:focus-visible:ring-foreground/20 tw:aria-selected:bg-foreground tw:aria-selected:text-background',
        selected: 'tw:bg-foreground tw:text-background',
        today: 'tw:text-foreground',
        rangeMiddle: 'tw:bg-muted tw:text-foreground',
        rangeStart: 'tw:bg-foreground tw:text-background',
        rangeEnd: 'tw:bg-foreground tw:text-background',
      },
      success: {
        dropdown: 'tw:focus-visible:border-success tw:focus-visible:ring-success/25',
        dayButton:
          'tw:hover:bg-success/50 tw:focus-visible:ring-success/25 tw:aria-selected:bg-success tw:aria-selected:text-success-foreground',
        selected: 'tw:bg-success tw:text-success-foreground',
        today: 'tw:text-success',
        rangeMiddle: 'tw:bg-success-muted tw:text-success-muted-foreground',
        rangeStart: 'tw:bg-success tw:text-success-foreground',
        rangeEnd: 'tw:bg-success tw:text-success-foreground',
      },
      error: {
        dropdown: 'tw:focus-visible:border-error tw:focus-visible:ring-error/25',
        dayButton:
          'tw:hover:bg-error/50 tw:focus-visible:ring-error/25 tw:aria-selected:bg-error tw:aria-selected:text-error-foreground',
        selected: 'tw:bg-error tw:text-error-foreground',
        today: 'tw:text-error',
        rangeMiddle: 'tw:bg-error-muted tw:text-error-muted-foreground',
        rangeStart: 'tw:bg-error tw:text-error-foreground',
        rangeEnd: 'tw:bg-error tw:text-error-foreground',
      },
    },
  },
  defaultVariants: { color: 'primary' },
});

type CalendarColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'error';
type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  color?: CalendarColor;
};
type CalendarFooterProps = React.ComponentProps<'div'>;

function CalendarFooter({
  children,
  className,
  role = 'group',
  'aria-label': ariaLabel = 'عملیات تقویم',
  ...props
}: CalendarFooterProps) {
  return (
    <div
      {...props}
      data-slot="calendar-footer"
      role={role}
      aria-label={ariaLabel}
      className={cn(
        'tw:flex tw:w-full tw:items-center tw:gap-2 tw:[&>*]:w-10 tw:[&>*]:flex-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  defaultMonth,
  today,
  startMonth = calendarStartMonth,
  endMonth = calendarEndMonth,
  captionLayout = 'dropdown',
  hideNavigation: _hideNavigation,
  color = 'primary',
  components,
  labels,
  modifiers,
  modifiersClassNames,
  ...props
}: CalendarProps) {
  const [clientToday, setClientToday] = useState<Date>();
  const [uncontrolledSelectedDate, setUncontrolledSelectedDate] = useState<Date | null | undefined>(
    null,
  );
  const colors = useMemo(() => calendarColorVariants({ color }), [color]);
  const selectorColor = color === 'neutral' ? 'secondary' : color;
  const resolvedToday = today ?? clientToday ?? prerenderDate;
  const resolvedDefaultMonth = defaultMonth ?? resolvedToday;
  const singleOnSelect = props.mode === 'single' ? props.onSelect : undefined;
  const isUncontrolledSingle = props.mode === 'single' && props.selected === undefined;

  const handleUncontrolledSingleSelect = useCallback<OnSelectHandler<Date | undefined>>(
    (selectedDate, triggerDate, modifiers, event) => {
      setUncontrolledSelectedDate(selectedDate);
      (singleOnSelect as OnSelectHandler<Date | undefined> | undefined)?.(
        selectedDate,
        triggerDate,
        modifiers,
        event,
      );
    },
    [singleOnSelect],
  );

  const uncontrolledSingleProps = useMemo(
    () =>
      isUncontrolledSingle
        ? ({
            selected: uncontrolledSelectedDate === null ? resolvedToday : uncontrolledSelectedDate,
            onSelect: handleUncontrolledSingleSelect,
          } satisfies Pick<PropsSingle, 'onSelect' | 'selected'>)
        : {},
    [handleUncontrolledSingleSelect, isUncontrolledSingle, resolvedToday, uncontrolledSelectedDate],
  );
  const selectionOverride: object = uncontrolledSingleProps;
  const resolvedClassNames = useMemo(
    () => ({
      root: cn('tw:w-fit', defaultClassNames.root),
      months: cn('tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row', defaultClassNames.months),
      month: cn('tw:flex tw:w-full tw:flex-col tw:gap-4', defaultClassNames.month),
      month_caption: cn(
        'tw:flex tw:min-h-8 tw:items-center tw:justify-center tw:text-label-m',
        defaultClassNames.month_caption,
      ),
      dropdowns: cn(
        'tw:flex tw:items-center tw:justify-center tw:gap-1',
        defaultClassNames.dropdowns,
      ),
      dropdown_root: cn('tw:relative', defaultClassNames.dropdown_root),
      dropdown: cn(colors.dropdown(), defaultClassNames.dropdown),
      months_dropdown: cn(defaultClassNames.months_dropdown),
      years_dropdown: cn(defaultClassNames.years_dropdown),
      month_grid: cn('tw:w-full tw:border-collapse', defaultClassNames.month_grid),
      weekdays: cn('tw:flex', defaultClassNames.weekdays),
      weekday: cn(
        'tw:flex-1 tw:text-center tw:text-label-s tw:text-muted-foreground',
        defaultClassNames.weekday,
      ),
      week: cn('tw:mt-1 tw:flex tw:w-full', defaultClassNames.week),
      day: cn('tw:relative tw:size-9 tw:p-0 tw:text-center', defaultClassNames.day),
      day_button: cn(
        'tw:flex tw:size-9 tw:items-center tw:justify-center tw:rounded-xl tw:text-label-s tw:transition-colors tw:focus-visible:ring-3',
        colors.dayButton(),
        defaultClassNames.day_button,
      ),
      selected: cn('tw:rounded-xl', colors.selected(), defaultClassNames.selected),
      today: cn('tw:font-bold', colors.today(), defaultClassNames.today),
      outside: cn('tw:text-muted-foreground/50', defaultClassNames.outside),
      disabled: cn('tw:text-muted-foreground/40', defaultClassNames.disabled),
      range_middle: cn('tw:rounded-xl', colors.rangeMiddle(), defaultClassNames.range_middle),
      range_start: cn('tw:rounded-xl', colors.rangeStart(), defaultClassNames.range_start),
      range_end: cn('tw:rounded-xl', colors.rangeEnd(), defaultClassNames.range_end),
      ...classNames,
    }),
    [classNames, colors],
  );
  const resolvedModifiers = useMemo(
    () => ({
      ...modifiers,
      holiday: [fridayHolidayMatcher, ...normalizeMatchers(modifiers?.holiday)],
    }),
    [modifiers],
  );
  const resolvedModifierClassNames = useMemo(
    () => ({
      ...modifiersClassNames,
      holiday: cn(
        "tw:after:pointer-events-none tw:after:absolute tw:after:top-1 tw:after:left-1 tw:after:size-1.5 tw:after:rounded-full tw:after:bg-error tw:after:ring-1 tw:after:ring-background tw:after:content-['']",
        modifiersClassNames?.holiday,
      ),
    }),
    [modifiersClassNames],
  );
  const resolvedLabels = useMemo(
    () => ({
      ...labels,
      labelDayButton: (...args: Parameters<typeof labelDayButton>) => {
        const resolvedLabel = (labels?.labelDayButton ?? labelDayButton)(...args);
        return args[1].holiday ? `${resolvedLabel}، تعطیل` : resolvedLabel;
      },
      labelGridcell: (...args: Parameters<typeof labelGridcell>) => {
        const resolvedLabel = (labels?.labelGridcell ?? labelGridcell)(...args);
        return args[1]?.holiday ? `${resolvedLabel}، تعطیل` : resolvedLabel;
      },
    }),
    [labels],
  );

  useEffect(() => {
    if (defaultMonth !== undefined && today !== undefined) return;

    const frameId = window.requestAnimationFrame(() => setClientToday(new Date()));

    return () => window.cancelAnimationFrame(frameId);
  }, [defaultMonth, today]);

  return (
    <DayPicker
      data-slot="calendar"
      key={defaultMonth === undefined ? clientToday?.getTime() : undefined}
      defaultMonth={resolvedDefaultMonth}
      today={resolvedToday}
      startMonth={startMonth}
      endMonth={endMonth}
      captionLayout={captionLayout}
      hideNavigation
      showOutsideDays={showOutsideDays}
      className={cn('tw:rounded-2xl tw:bg-background tw:p-3 tw:text-foreground', className)}
      classNames={resolvedClassNames}
      modifiers={resolvedModifiers}
      modifiersClassNames={resolvedModifierClassNames}
      labels={resolvedLabels}
      components={{
        Dropdown: (dropdownProps) => <CalendarDropdown {...dropdownProps} color={selectorColor} />,
        ...components,
      }}
      {...props}
      {...selectionOverride}
    />
  );
}

export { Calendar, CalendarFooter, type CalendarFooterProps, type CalendarProps };
