'use client';

import { useId, type ChangeEvent, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { Field } from '@/components/ui/field/default';
import { Input, type InputProps } from '@/components/ui/fields/input';
import { cn } from '@/lib/utils';

type FileFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  InputProps,
  | 'accept'
  | 'children'
  | 'className'
  | 'defaultValue'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'ref'
  | 'type'
  | 'value'
> & {
  acceptTypes: readonly string[];
  children: (file: File | null) => ReactNode;
  className?: string;
  control?: Control<TFieldValues>;
  hint?: ReactNode;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
};

function toAcceptAttribute(acceptTypes: readonly string[]) {
  return acceptTypes
    .map((acceptType) => acceptType.trim())
    .filter(Boolean)
    .join(',');
}

function FileField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  acceptTypes,
  'aria-label': ariaLabel = 'انتخاب فایل',
  children,
  className,
  control,
  disabled,
  hint,
  id: providedId,
  name,
  rules,
  shouldUnregister,
  ...inputProps
}: FileFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController({ control, disabled, name, rules, shouldUnregister });
  const { value: _value, ...fileInputField } = field;
  const value = field.value as unknown;
  const file = typeof File !== 'undefined' && value instanceof File ? value : null;
  const message = fieldState.error?.message ?? hint;
  const accept = toAcceptAttribute(acceptTypes);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    field.onChange(event.target.files?.[0] ?? null);
  }

  return (
    <Field data-invalid={fieldState.invalid || undefined} data-disabled={disabled || undefined}>
      <label
        htmlFor={id}
        className={cn(
          'tw:block tw:cursor-pointer tw:rounded-xl tw:focus-within:outline-none tw:focus-within:ring-3 tw:focus-within:ring-ring/30',
          fieldState.invalid && 'tw:ring-1 tw:ring-error',
          disabled && 'tw:cursor-not-allowed tw:opacity-50',
          className,
        )}
      >
        <Input
          {...inputProps}
          id={id}
          {...fileInputField}
          type="file"
          accept={accept}
          disabled={disabled}
          color={fieldState.invalid ? 'error' : 'primary'}
          aria-label={ariaLabel}
          aria-invalid={fieldState.invalid}
          aria-describedby={descriptionId}
          className="tw:sr-only"
          onChange={handleChange}
        />
        {children(file)}
      </label>
      <span
        id={descriptionId}
        role={fieldState.invalid ? 'alert' : undefined}
        className="tw:block tw:min-h-[1lh] tw:text-xs tw:text-muted-foreground"
      >
        <span className={fieldState.invalid ? 'tw:text-error' : undefined}>{message}</span>
      </span>
    </Field>
  );
}

export { FileField, toAcceptAttribute, type FileFieldProps };
