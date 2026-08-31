'use client';

import { useId, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

type SelectFieldOption = {
  value: string | boolean | null;
  label: ReactNode;
  disabled?: boolean;
};

type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  label: ReactNode;
  options: readonly SelectFieldOption[];
  hint?: ReactNode;
  emptyText?: ReactNode;
  placeholder?: ReactNode;
  control?: Control<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
};

function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  hint,
  emptyText = 'گزینه‌ای برای انتخاب وجود ندارد.',
  placeholder = 'انتخاب کنید',
  control,
  rules,
  shouldUnregister,
  disabled,
  readOnly,
  required,
  id: providedId,
  className,
  contentClassName,
  triggerClassName,
}: SelectFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController({ name, control, rules, shouldUnregister, disabled });
  const message = fieldState.error?.message ?? hint;

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={className}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        items={options}
        name={field.name}
        inputRef={field.ref}
        value={field.value ?? null}
        onValueChange={(value) => field.onChange(value)}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      >
        <SelectTrigger
          id={id}
          className={triggerClassName}
          onBlur={field.onBlur}
          aria-invalid={fieldState.invalid}
          aria-describedby={descriptionId}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.length > 0 ? (
            <SelectGroup>
              {options.map((option, index) => (
                <SelectItem
                  key={`${option.value}-${index}`}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            <p
              role="status"
              className="tw:flex tw:min-h-24 tw:items-center tw:justify-center tw:px-4 tw:text-center tw:text-body-s tw:text-muted-foreground"
            >
              {emptyText}
            </p>
          )}
        </SelectContent>
      </Select>
      <span
        id={descriptionId}
        role={fieldState.invalid ? 'alert' : undefined}
        className="tw:-mt-1 tw:block tw:min-h-[1lh] tw:text-xs tw:text-muted-foreground"
      >
        <span className={fieldState.invalid ? 'tw:text-error' : undefined}>{message}</span>
      </span>
    </Field>
  );
}

export { SelectField, type SelectFieldOption, type SelectFieldProps };
