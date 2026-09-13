'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';
import { Form } from '@/components/ui/form';
import type { RangeFilterDTO } from '@/entities/pagination/pagination.types';

type RangeValues = { maximum: number | null; minimum: number | null };

type RangePaginationFilterProps = Readonly<{
  disabled: boolean;
  filter: RangeFilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  onDelete: () => void;
  value?: string;
}>;

function toNumber(value: string | undefined) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function toRangeValue(values: RangeValues, filter: RangeFilterDTO) {
  const minimum = clamp(values.minimum ?? filter.min, filter.min, filter.max);
  const maximum = clamp(values.maximum ?? filter.max, filter.min, filter.max);
  return `${minimum}-${maximum}`;
}

function RangeFields({
  disabled,
  filter,
  idPrefix,
  onChange,
}: Omit<RangePaginationFilterProps, 'onDelete' | 'value'>) {
  const { control } = useFormContext<RangeValues>();
  const [minimum, maximum] = useWatch({ control, name: ['minimum', 'maximum'] });
  const initialValueRef = useRef(toRangeValue({ minimum, maximum }, filter));
  const rangeValue = toRangeValue({ minimum, maximum }, filter);

  useEffect(() => {
    if (rangeValue === initialValueRef.current) return;
    initialValueRef.current = rangeValue;
    onChange(rangeValue);
  }, [onChange, rangeValue]);

  return (
    <>
      <PriceMaskField<RangeValues>
        id={`${idPrefix}-${filter.key}-minimum`}
        name="minimum"
        label={`از ${filter.unit ?? 'قیمت'}`}
        min={filter.min}
        max={filter.max}
        step={filter.step}
        disabled={disabled}
      />
      <PriceMaskField<RangeValues>
        id={`${idPrefix}-${filter.key}-maximum`}
        name="maximum"
        label={`تا ${filter.unit ?? 'قیمت'}`}
        min={filter.min}
        max={filter.max}
        step={filter.step}
        disabled={disabled}
      />
    </>
  );
}

export function RangePaginationFilter({
  disabled,
  filter,
  idPrefix,
  onChange,
  onDelete,
  value,
}: RangePaginationFilterProps) {
  const [minimum, maximum] = value?.split('-') ?? [];
  const defaultValues = { minimum: toNumber(minimum), maximum: toNumber(maximum) };

  return (
    <fieldset className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
      <legend className="tw:sr-only">{filter.label}</legend>
      <Form<RangeValues>
        handleSubmit={() => undefined}
        options={{ defaultValues }}
        className="tw:gap-3"
      >
        <RangeFields disabled={disabled} filter={filter} idPrefix={idPrefix} onChange={onChange} />
      </Form>
      <Button
        block
        size="sm"
        color="error"
        variant="outlined"
        disabled={disabled || !value}
        onClick={onDelete}
      >
        <Trash2Icon data-icon="inline-start" aria-hidden="true" />
        حذف فیلتر
      </Button>
    </fieldset>
  );
}
