'use client';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import type { SelectFilterDTO } from '@/entities/pagination/pagination.types';

type SelectPaginationFilterProps = Readonly<{
  disabled: boolean;
  filter: SelectFilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  onDelete: () => void;
  value?: string;
}>;

export function SelectPaginationFilter({
  disabled,
  filter,
  idPrefix,
  onChange,
  onDelete,
  value,
}: SelectPaginationFilterProps) {
  return (
    <fieldset className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
      <legend className="tw:sr-only">{filter.label}</legend>
      <RadioGroup
        aria-label={filter.label}
        value={value ?? null}
        disabled={disabled}
        onValueChange={(nextValue) => onChange(nextValue ?? undefined)}
      >
        {filter.options.map((option, index) => {
          const id = `${idPrefix}-${filter.key}-${index}`;
          const label =
            option.count === undefined ? option.label : `${option.label} (${option.count})`;

          return (
            <Field key={option.value} className="tw:flex-row tw:items-center">
              <RadioGroupItem id={id} value={option.value} size="sm" />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          );
        })}
      </RadioGroup>
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
