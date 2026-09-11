'use client';

import { memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import type { DateRange } from 'react-day-picker';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarFooter } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { inputVariants } from '@/components/ui/fields/input';
import { textFieldColorClasses, textFieldVariants } from '@/components/ui/fields/text-field';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { TimeSelector, type TimeSelectorValue } from '@/components/ui/time-selector';
import { cn } from '@/lib/utils';

import { formatJalaliDateTime, normalizeIsoDateTime } from './date-picker';

export type RangedDatePickerValue = { from: string; to: string };
type DraftTime = { value: TimeSelectorValue; milliseconds: number };

const rangedDatePickerTriggerVariants = tv({
  extend: inputVariants,
  base: [
    'tw:items-center tw:justify-start tw:gap-2 tw:text-start',
    'tw:data-[invalid=true]:border-error tw:data-[invalid=true]:ring-3 tw:data-[invalid=true]:ring-error/20',
  ],
});

function formatTime(date: Date): TimeSelectorValue {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':') as TimeSelectorValue;
}

function mergeTime(date: Date, time: DraftTime) {
  const [hours, minutes, seconds] = time.value.split(':').map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, seconds, time.milliseconds);
  return next;
}

function normalizeRangeValue(value: unknown): RangedDatePickerValue | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const range = value as Partial<RangedDatePickerValue>;
  const from = normalizeIsoDateTime(range.from);
  const to = normalizeIsoDateTime(range.to);
  return from && to ? { from, to } : undefined;
}

type RangedDatePickerCalendarProps = {
  selected: DateRange;
  onSelect: (range: DateRange | undefined) => void;
};

const RangedDatePickerCalendar = memo(function RangedDatePickerCalendar({
  selected,
  onSelect,
}: RangedDatePickerCalendarProps) {
  return (
    <Calendar mode="range" selected={selected} defaultMonth={selected.from} onSelect={onSelect} />
  );
});

type RangedDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TFromDateKey extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TToDateKey extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = VariantProps<typeof rangedDatePickerTriggerVariants> & {
  fromDateKey?: TFromDateKey;
  toDateKey?: TToDateKey;
  control?: Control<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, TFromDateKey>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  toRules?: Omit<
    RegisterOptions<TFieldValues, TToDateKey>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
  className?: string;
  defaultValue?: RangedDatePickerValue;
  disabled?: boolean;
  hasTime?: boolean;
  hint?: ReactNode;
  id?: string;
  label: ReactNode;
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onValueChange?: (value: RangedDatePickerValue) => void;
};

function RangedDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TFromDateKey extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TToDateKey extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
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
  onValueChange,
  placeholder = 'DD/MM/YYYY — DD/MM/YYYY',
  fromDateKey = 'from' as TFromDateKey,
  rules,
  shouldUnregister,
  size = 'md',
  toDateKey = 'to' as TToDateKey,
  toRules,
}: RangedDatePickerProps<TFieldValues, TFromDateKey, TToDateKey>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const normalizedDefaultValue = normalizeRangeValue(defaultValue);
  const { field: fromField, fieldState: fromFieldState } = useController({
    control,
    disabled,
    name: fromDateKey,
    rules,
    shouldUnregister,
    ...(normalizedDefaultValue
      ? { defaultValue: normalizedDefaultValue.from as FieldPathValue<TFieldValues, TFromDateKey> }
      : {}),
  });
  const { field: toField, fieldState: toFieldState } = useController({
    control,
    disabled,
    name: toDateKey,
    rules: toRules,
    shouldUnregister,
    ...(normalizedDefaultValue
      ? { defaultValue: normalizedDefaultValue.to as FieldPathValue<TFieldValues, TToDateKey> }
      : {}),
  });
  const {
    name: fromFieldName,
    onBlur: handleFromBlur,
    onChange: handleFromChange,
    ref: fromFieldRef,
    value: fromFieldValue,
  } = fromField;
  const {
    onBlur: handleToBlur,
    onChange: handleToChange,
    ref: toFieldRef,
    value: toFieldValue,
  } = toField;
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange>();
  const [draftFromTime, setDraftFromTime] = useState<DraftTime>();
  const [draftToTime, setDraftToTime] = useState<DraftTime>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentValue = useMemo(
    () => normalizeRangeValue({ from: fromFieldValue, to: toFieldValue }),
    [fromFieldValue, toFieldValue],
  );
  const currentRange = useMemo<DateRange | undefined>(
    () =>
      currentValue
        ? { from: new Date(currentValue.from), to: new Date(currentValue.to) }
        : undefined,
    [currentValue],
  );
  const styles = textFieldVariants({ color, size });
  const isInvalid = fromFieldState.invalid || toFieldState.invalid;
  const message = fromFieldState.error?.message ?? toFieldState.error?.message ?? hint;
  const displayValue =
    currentRange?.from && currentRange.to
      ? `${formatJalaliDateTime(currentRange.from)} — ${formatJalaliDateTime(currentRange.to)}`
      : '';

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        const from = currentRange?.from ?? new Date();
        const to = currentRange?.to ?? from;
        setDraftRange({ from, to });
        setDraftFromTime({ value: formatTime(from), milliseconds: from.getMilliseconds() });
        setDraftToTime({ value: formatTime(to), milliseconds: to.getMilliseconds() });
      }

      setOpen(nextOpen);
      if (!nextOpen) {
        setDraftRange(undefined);
        setDraftFromTime(undefined);
        setDraftToTime(undefined);
        handleFromBlur();
        handleToBlur();
        queueMicrotask(() => triggerRef.current?.focus());
      }
    },
    [currentRange, handleFromBlur, handleToBlur],
  );

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

  const accept = useCallback(() => {
    if (!draftRange?.from || !draftRange.to || !draftFromTime || !draftToTime) return;
    const value = {
      from: mergeTime(draftRange.from, draftFromTime).toISOString(),
      to: mergeTime(draftRange.to, draftToTime).toISOString(),
    };
    handleFromChange(value.from);
    handleToChange(value.to);
    onValueChange?.(value);
    close();
  }, [
    close,
    draftFromTime,
    draftRange,
    draftToTime,
    handleFromChange,
    handleToChange,
    onValueChange,
  ]);

  const selectToday = useCallback(() => {
    const now = new Date();
    setDraftRange({ from: now, to: now });
    const time = { value: formatTime(now), milliseconds: now.getMilliseconds() };
    setDraftFromTime(time);
    setDraftToTime(time);
  }, []);

  return (
    <Field
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={styles.field()}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        <span className={isInvalid ? 'tw:text-error' : textFieldColorClasses[color]}>{label}</span>
      </FieldLabel>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <button
              ref={(node) => {
                triggerRef.current = node;
                fromFieldRef(node);
                toFieldRef(node);
              }}
              type="button"
              id={id}
              name={fromFieldName}
              disabled={disabled}
              data-slot="field-control"
              data-color={color}
              data-size={size}
              data-invalid={isInvalid || undefined}
              aria-label={ariaLabel}
              aria-describedby={
                ariaDescribedBy ? `${descriptionId} ${ariaDescribedBy}` : descriptionId
              }
              className={cn(
                rangedDatePickerTriggerVariants({ color, size }),
                !displayValue && 'tw:text-muted-foreground',
                className,
              )}
            />
          }
        >
          <span
            aria-hidden="true"
            data-slot="ranged-date-picker-icon"
            className={cn(styles.icon(), 'tw:static tw:shrink-0', isInvalid && 'tw:text-error')}
          >
            <CalendarDaysIcon />
          </span>
          <span
            className="tw:flex tw:h-full tw:min-w-0 tw:flex-1 tw:items-center tw:truncate"
            dir="ltr"
          >
            {displayValue || placeholder}
          </span>
        </PopoverTrigger>
        {open ? (
          <PopoverContent
            align="start"
            className="tw:w-auto"
            data-slot="ranged-date-picker-content"
          >
            <PopoverTitle className="tw:sr-only">انتخاب بازه تاریخ</PopoverTitle>
            {draftRange ? (
              <RangedDatePickerCalendar selected={draftRange} onSelect={setDraftRange} />
            ) : (
              <div
                role="status"
                aria-label="در حال آماده‌سازی تقویم"
                className="skeleton tw:h-80 tw:w-[276px] tw:rounded-2xl"
              />
            )}
            {hasTime && draftFromTime && draftToTime ? (
              <div className="tw:flex tw:flex-col tw:gap-3">
                <TimeSelector
                  value={draftFromTime.value}
                  label="زمان شروع"
                  color={color}
                  variant="outlined"
                  onValueChange={(value) =>
                    setDraftFromTime((time) => ({ value, milliseconds: time?.milliseconds ?? 0 }))
                  }
                />
                <TimeSelector
                  value={draftToTime.value}
                  label="زمان پایان"
                  color={color}
                  variant="outlined"
                  onValueChange={(value) =>
                    setDraftToTime((time) => ({ value, milliseconds: time?.milliseconds ?? 0 }))
                  }
                />
              </div>
            ) : null}
            <CalendarFooter>
              <Button
                type="button"
                size="sm"
                onClick={accept}
                disabled={!draftRange?.from || !draftRange.to}
              >
                تأیید
              </Button>
              <Button type="button" size="sm" variant="outlined" onClick={selectToday}>
                امروز
              </Button>
              <Button type="button" size="sm" variant="outlined" color="error" onClick={close}>
                لغو
              </Button>
            </CalendarFooter>
          </PopoverContent>
        ) : null}
      </Popover>
      <span
        id={descriptionId}
        role={isInvalid ? 'alert' : undefined}
        className={styles.description()}
      >
        <span className={isInvalid ? 'tw:text-error' : 'tw:text-muted-foreground'}>{message}</span>
      </span>
    </Field>
  );
}

export { RangedDatePicker, rangedDatePickerTriggerVariants, type RangedDatePickerProps };
