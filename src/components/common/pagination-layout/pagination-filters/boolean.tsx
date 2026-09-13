'use client';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Switch } from '@/components/ui/fields/switch';
import type { BooleanFilterDTO } from '@/entities/pagination/pagination.types';

type BooleanPaginationFilterProps = Readonly<{
  disabled: boolean;
  filter: BooleanFilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  onDelete: () => void;
  value?: string;
}>;

export function BooleanPaginationFilter({
  disabled,
  filter,
  idPrefix,
  onChange,
  onDelete,
  value,
}: BooleanPaginationFilterProps) {
  const id = `${idPrefix}-${filter.key}`;
  const count = filter.options?.[0]?.count ?? filter.count;
  const enabledLabel = filter.options?.find((option) => option.value)?.label ?? 'بله';
  const disabledLabel = filter.options?.find((option) => !option.value)?.label ?? 'خیر';
  const stateLabel =
    value === undefined ? 'انتخاب نشده' : value === 'true' ? enabledLabel : disabledLabel;

  return (
    <fieldset className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
      <legend className="tw:sr-only">{filter.label}</legend>
      <Field className="tw:flex-row tw:items-center tw:justify-between">
        <FieldLabel htmlFor={id}>
          {filter.label}
          {count === undefined ? null : ` (${count})`}
        </FieldLabel>
        <div className="tw:flex tw:items-center tw:gap-2">
          <span className="tw:text-label-s tw:text-muted-foreground">{stateLabel}</span>
          <Switch
            id={id}
            size="sm"
            checked={value === 'true'}
            disabled={disabled}
            aria-label={`${filter.label}: ${stateLabel}`}
            onCheckedChange={(checked) => onChange(String(checked))}
          />
        </div>
      </Field>
      <Button
        block
        size="sm"
        color="error"
        variant="outlined"
        disabled={disabled || value === undefined}
        onClick={onDelete}
      >
        <Trash2Icon data-icon="inline-start" aria-hidden="true" />
        حذف فیلتر
      </Button>
    </fieldset>
  );
}
