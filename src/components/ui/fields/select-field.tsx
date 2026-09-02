'use client';

import { useId, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const selectFieldVariants = tv({
  slots: {
    field: '',
    label: '',
    description: 'tw:block tw:min-h-[1lh] tw:text-muted-foreground',
  },
  variants: {
    size: {
      xs: { field: 'tw:gap-1', label: 'tw:text-label-s', description: 'tw:-mt-0.5 tw:text-xs' },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
      },
      md: { field: 'tw:gap-2', label: 'tw:text-label-m', description: 'tw:-mt-1 tw:text-xs' },
      lg: {
        field: 'tw:gap-2',
        label: 'tw:text-label-l',
        description: 'tw:-mt-1 tw:text-[13px]/[1.6]',
      },
      xl: {
        field: 'tw:gap-2.5',
        label: 'tw:text-label-l',
        description: 'tw:-mt-1.5 tw:text-[13px]/[1.6]',
      },
    },
  },
  defaultVariants: { size: 'md' },
});

type SelectFieldOption = {
  value: string | boolean | null;
  label: ReactNode;
  disabled?: boolean;
};

type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = VariantProps<typeof selectFieldVariants> & {
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
  onValueChange?: (value: string | boolean | null) => void;
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
  size = 'md',
  shouldUnregister,
  disabled,
  readOnly,
  required,
  id: providedId,
  className,
  contentClassName,
  triggerClassName,
  onValueChange,
}: SelectFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController({ name, control, rules, shouldUnregister, disabled });
  const message = fieldState.error?.message ?? hint;
  const styles = selectFieldVariants({ size });

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-size={size}
      className={cn(styles.field(), className)}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        {label}
      </FieldLabel>
      <Select
        items={options}
        name={field.name}
        inputRef={field.ref}
        value={field.value ?? null}
        onValueChange={(value) => {
          field.onChange(value);
          onValueChange?.(value);
        }}
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
        className={styles.description()}
      >
        <span className={fieldState.invalid ? 'tw:text-error' : undefined}>{message}</span>
      </span>
    </Field>
  );
}

export { SelectField, selectFieldVariants, type SelectFieldOption, type SelectFieldProps };
