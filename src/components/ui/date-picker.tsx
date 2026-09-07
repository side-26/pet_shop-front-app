'use client';

import * as React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarFooter } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { inputVariants } from '@/components/ui/fields/input';
import { textFieldColorClasses, textFieldVariants } from '@/components/ui/fields/text-field';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import type { TimeSelectorValue } from '@/components/ui/time-selector';
import { cn } from '@/lib/utils';

const preloadTimeSelector = () => import('@/components/ui/time-selector');
const LazyTimeSelector = dynamic(() =>
  import('@/components/ui/time-selector').then((module) => module.TimeSelector),
);

const isoDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

function normalizeIsoDateTime(value?: string) {
  if (!value || !isoDateTimePattern.test(value)) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function formatJalaliDateTime(date: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat('en-GB-u-ca-persian', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZone,
    year: 'numeric',
  }).formatToParts(date);
  const partValues = new Map(parts.map(({ type, value }) => [type, value]));

  return `${partValues.get('day')}/${partValues.get('month')}/${partValues.get('year')} ${partValues.get('hour')}:${partValues.get('minute')}:${partValues.get('second')}`;
}

function formatTimeValue(date: Date): TimeSelectorValue {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':') as TimeSelectorValue;
}

function mergeTimeWithDate(date: Date, value: TimeSelectorValue, milliseconds: number) {
  const [hours, minutes, seconds] = value.split(':').map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, seconds, milliseconds);
  return nextDate;
}

type DraftTime = { value: TimeSelectorValue; milliseconds: number };

type DatePickerCalendarProps = {
  selected: Date;
  today?: Date;
  onSelect: (selectedDay: Date | undefined) => void;
};

const DatePickerCalendar = React.memo(function DatePickerCalendar({
  selected,
  today,
  onSelect,
}: DatePickerCalendarProps) {
  return (
    <Calendar
      mode="single"
      required
      selected={selected}
      defaultMonth={selected}
      today={today}
      onSelect={onSelect}
    />
  );
});

const datePickerTriggerVariants = tv({
  extend: inputVariants,
  base: [
    'tw:items-center tw:justify-start tw:gap-2 tw:text-start',
    'tw:data-[invalid=true]:border-error tw:data-[invalid=true]:ring-3 tw:data-[invalid=true]:ring-error/20',
  ],
});

type DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = VariantProps<typeof datePickerTriggerVariants> & {
  name: TName;
  control?: Control<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  hasTime?: boolean;
  hint?: ReactNode;
  id?: string;
  label: ReactNode;
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onValueChange?: (value: string) => void;
};

function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  className,
  color = 'primary',
  control,
  defaultValue,
  disabled,
  hasTime = false,
  hint,
  id: providedId,
  label,
  name,
  onValueChange,
  placeholder = 'DD/MM/YYYY HH:mm:ss',
  rules,
  shouldUnregister,
  size = 'md',
}: DatePickerProps<TFieldValues, TName>) {
  const generatedId = React.useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const normalizedDefaultValue = normalizeIsoDateTime(defaultValue);
  const { field, fieldState } = useController({
    control,
    disabled,
    name,
    rules,
    shouldUnregister,
    ...(normalizedDefaultValue
      ? { defaultValue: normalizedDefaultValue as FieldPathValue<TFieldValues, TName> }
      : {}),
  });
  const {
    name: fieldName,
    onBlur: handleFieldBlur,
    onChange: handleFieldChange,
    ref: fieldRef,
    value: fieldValue,
  } = field;
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [draftDay, setDraftDay] = React.useState<Date>();
  const [draftTime, setDraftTime] = React.useState<DraftTime>();
  const [open, setOpen] = React.useState(false);
  const hasInitializedValue = React.useRef(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const committedValue = normalizeIsoDateTime(
    typeof fieldValue === 'string' ? fieldValue : undefined,
  );
  const committedDate = React.useMemo(
    () => (committedValue ? new Date(committedValue) : undefined),
    [committedValue],
  );
  const displayValue = React.useMemo(
    () => (currentDate && committedDate ? formatJalaliDateTime(committedDate) : ''),
    [committedDate, currentDate],
  );
  const message = fieldState.error?.message ?? hint;
  const styles = textFieldVariants({ color, size });

  React.useEffect(() => {
    if (!hasInitializedValue.current && !committedValue) {
      handleFieldChange(currentDate.toISOString());
    }
    hasInitializedValue.current = true;
  }, [committedValue, currentDate, handleFieldChange]);

  React.useEffect(() => {
    if (!hasTime) return;

    const preload = () => void preloadTimeSelector();
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(preload, 0);
    return () => globalThis.clearTimeout(timeoutId);
  }, [hasTime]);

  React.useEffect(() => {
    if (!open || draftDay || draftTime) return;

    let timeoutId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        const nextDraft = committedDate ?? new Date();
        setDraftDay(nextDraft);
        setDraftTime({
          value: formatTimeValue(nextDraft),
          milliseconds: nextDraft.getMilliseconds(),
        });
      }, 0);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [committedDate, draftDay, draftTime, open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setDraftDay(undefined);
        setDraftTime(undefined);
        handleFieldBlur();
        queueMicrotask(() => triggerRef.current?.focus());
      }
    },
    [handleFieldBlur],
  );

  const handleDaySelect = React.useCallback((selectedDay: Date | undefined) => {
    if (selectedDay) setDraftDay(selectedDay);
  }, []);

  const handleTimeChange = React.useCallback((value: TimeSelectorValue) => {
    setDraftTime((currentTime) => ({
      value,
      milliseconds: currentTime?.milliseconds ?? 0,
    }));
  }, []);

  const handleCancel = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const handleToday = React.useCallback(() => {
    const now = new Date();
    setCurrentDate(now);
    setDraftDay(now);
    setDraftTime({ value: formatTimeValue(now), milliseconds: now.getMilliseconds() });
  }, []);

  const handleAccept = React.useCallback(() => {
    if (!draftDay || !draftTime) return;

    const nextValue = mergeTimeWithDate(
      draftDay,
      draftTime.value,
      draftTime.milliseconds,
    ).toISOString();
    handleFieldChange(nextValue);
    onValueChange?.(nextValue);
    handleOpenChange(false);
  }, [draftDay, draftTime, handleFieldChange, handleOpenChange, onValueChange]);

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={styles.field()}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        <span className={fieldState.invalid ? 'tw:text-error' : textFieldColorClasses[color]}>
          {label}
        </span>
      </FieldLabel>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <button
              ref={(node) => {
                triggerRef.current = node;
                fieldRef(node);
              }}
              type="button"
              id={id}
              name={fieldName}
              disabled={disabled}
              data-slot="field-control"
              data-color={color}
              data-size={size}
              data-invalid={fieldState.invalid || undefined}
              aria-label={ariaLabel}
              aria-describedby={
                ariaDescribedBy ? `${descriptionId} ${ariaDescribedBy}` : descriptionId
              }
              className={cn(
                datePickerTriggerVariants({ color, size }),
                !displayValue && 'tw:text-muted-foreground',
                className,
              )}
            />
          }
        >
          <span
            aria-hidden="true"
            data-slot="date-picker-icon"
            className={cn(
              styles.icon(),
              'tw:static tw:shrink-0',
              fieldState.invalid && 'tw:text-error',
            )}
          >
            <CalendarDaysIcon />
          </span>
          <span className="tw:flex tw:h-full tw:min-w-0 tw:flex-1 tw:items-center" dir="ltr">
            {displayValue || placeholder}
          </span>
        </PopoverTrigger>

        {open ? (
          <PopoverContent align="start" className="tw:w-auto" data-slot="date-picker-content">
            <PopoverTitle className="tw:sr-only">انتخاب تاریخ و زمان</PopoverTitle>
            {draftDay ? (
              <DatePickerCalendar
                selected={draftDay}
                today={currentDate}
                onSelect={handleDaySelect}
              />
            ) : (
              <div
                role="status"
                aria-label="در حال آماده‌سازی تقویم"
                className="skeleton tw:h-80 tw:w-[276px] tw:rounded-2xl"
              />
            )}
            {hasTime && draftTime ? (
              <LazyTimeSelector
                value={draftTime.value}
                color={color}
                variant="outlined"
                onValueChange={handleTimeChange}
              />
            ) : null}
            <CalendarFooter>
              <Button type="button" size="sm" onClick={handleAccept} disabled={!draftDay}>
                تأیید
              </Button>
              <Button type="button" size="sm" variant="outlined" onClick={handleToday}>
                امروز
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outlined"
                color="error"
                onClick={handleCancel}
              >
                لغو
              </Button>
            </CalendarFooter>
          </PopoverContent>
        ) : null}
      </Popover>
      <span
        id={descriptionId}
        role={fieldState.invalid ? 'alert' : undefined}
        className={styles.description()}
      >
        <span className={fieldState.invalid ? 'tw:text-error' : 'tw:text-muted-foreground'}>
          {message}
        </span>
      </span>
    </Field>
  );
}

export {
  DatePicker,
  datePickerTriggerVariants,
  formatJalaliDateTime,
  normalizeIsoDateTime,
  type DatePickerProps,
};
