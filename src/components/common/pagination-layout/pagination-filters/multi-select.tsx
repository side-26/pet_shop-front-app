'use client';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import type { MultiSelectFilterDTO } from '@/entities/pagination/pagination.types';

type MultiSelectPaginationFilterProps = Readonly<{
  disabled: boolean;
  filter: MultiSelectFilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  onDelete: () => void;
  value?: string;
}>;

function selectedValues(value?: string) {
  return new Set(value?.split(',').filter(Boolean) ?? []);
}

export function MultiSelectPaginationFilter({
  disabled,
  filter,
  idPrefix,
  onChange,
  onDelete,
  value,
}: MultiSelectPaginationFilterProps) {
  const selected = selectedValues(value);

  return (
    <fieldset className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
      <legend className="tw:sr-only">{filter.label}</legend>
      {filter.options.map((option, index) => {
        const id = `${idPrefix}-${filter.key}-${index}`;
        const label =
          option.count === undefined ? option.label : `${option.label} (${option.count})`;

        return (
          <Field key={option.value} className="tw:flex-row tw:items-center">
            <Checkbox
              id={id}
              size="sm"
              checked={selected.has(option.value)}
              disabled={disabled}
              onCheckedChange={(checked) => {
                const next = new Set(selected);
                if (checked) next.add(option.value);
                else next.delete(option.value);
                onChange([...next].join(','));
              }}
            />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </Field>
        );
      })}
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
