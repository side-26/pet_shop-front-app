'use client';

import { CirclePlusIcon, Trash2Icon } from 'lucide-react';
import {
  useFieldArray,
  type Control,
  type FieldArrayPath,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import type { AdditionalProperty } from '@/components/common/additional-properties';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';

type AdditionalPropertiesFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldArrayPath<TFieldValues>,
> = {
  addLabel?: string;
  control?: Control<TFieldValues>;
  disabled?: boolean;
  label?: string;
  maxItems?: number;
  name: TName;
};

function AdditionalPropertiesField<
  TFieldValues extends FieldValues,
  TName extends FieldArrayPath<TFieldValues>,
>({
  addLabel = 'افزودن مشخصات',
  control,
  disabled = false,
  label = 'مشخصات بیشتر',
  maxItems = 20,
  name,
}: AdditionalPropertiesFieldProps<TFieldValues, TName>) {
  const { append, fields, remove } = useFieldArray({ control, name });
  const canAdd = !disabled && fields.length < maxItems;

  return (
    <fieldset disabled={disabled} className="tw:flex tw:flex-col tw:gap-3">
      <legend className="tw:text-title-s tw:text-foreground">{label}</legend>
      {fields.map((field, index) => {
        const fieldName = `${name}.${index}` as FieldPath<TFieldValues>;

        return (
          <div
            key={field.id}
            className="tw:grid tw:grid-cols-1 tw:items-start tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-muted/25 tw:p-3 tw:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <TextField<TFieldValues>
              name={`${fieldName}.label` as FieldPath<TFieldValues>}
              label="عنوان"
              placeholder="مانند رنگ"
              required
            />
            <TextField<TFieldValues>
              name={`${fieldName}.value` as FieldPath<TFieldValues>}
              label="مقدار"
              placeholder="مانند قهوه‌ای"
              required
            />
            <Button
              type="button"
              iconOnly
              variant="flat"
              color="error"
              aria-label={`حذف مشخصات ${index + 1}`}
              className="tw:sm:mt-8"
              onClick={() => remove(index)}
            >
              <Trash2Icon aria-hidden="true" />
            </Button>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outlined"
        color="primary"
        disabled={!canAdd}
        onClick={() => append({ label: '', value: '' } as never)}
      >
        <CirclePlusIcon data-icon="inline-start" aria-hidden="true" />
        {addLabel}
      </Button>
    </fieldset>
  );
}

export { AdditionalPropertiesField, type AdditionalPropertiesFieldProps, type AdditionalProperty };
