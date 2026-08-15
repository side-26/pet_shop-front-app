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
import { RadioGroup, RadioGroupItem } from './radio-group';
import type { SelectionColor, SelectionSize, SelectionVariant } from './selection-control.styles';
import { selectionFieldVariants } from './selection-field.styles';

type RadioGroupFieldOption = { value: string; label: ReactNode; disabled?: boolean };
type RadioGroupFieldProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
> = {
  name: N;
  label: ReactNode;
  options: readonly RadioGroupFieldOption[];
  hint?: ReactNode;
  control?: Control<T>;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  variant?: SelectionVariant;
  checkedColor?: SelectionColor;
  uncheckedColor?: SelectionColor;
  size?: SelectionSize;
  rules?: Omit<RegisterOptions<T, N>, 'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'>;
  shouldUnregister?: boolean;
  className?: string;
};

function RadioGroupField<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
>({
  name,
  label,
  options,
  hint,
  control,
  disabled,
  readOnly,
  required,
  variant = 'fill',
  checkedColor = 'primary',
  uncheckedColor = 'secondary',
  size = 'md',
  rules,
  shouldUnregister,
  className,
}: RadioGroupFieldProps<T, N>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const labelId = `${id}-label`;
  const { field, fieldState } = useController({ name, control, rules, shouldUnregister, disabled });
  const styles = selectionFieldVariants({ size });
  const message = fieldState.error?.message ?? hint;
  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={styles.field()}
    >
      <span id={labelId} className={styles.label()}>
        {label}
      </span>
      <RadioGroup
        name={field.name}
        value={typeof field.value === 'string' ? field.value : undefined}
        onValueChange={field.onChange}
        inputRef={field.ref}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        aria-invalid={fieldState.invalid}
        className={className ?? styles.options()}
      >
        {options.map((option, index) => {
          const optionId = `${id}-${index}`;
          return (
            <div key={option.value} className={styles.controlRow()}>
              <RadioGroupItem
                id={optionId}
                value={option.value}
                disabled={option.disabled}
                variant={variant}
                checkedColor={checkedColor}
                uncheckedColor={uncheckedColor}
                size={size}
              />
              <FieldLabel htmlFor={optionId} className={styles.label()}>
                {option.label}
              </FieldLabel>
            </div>
          );
        })}
      </RadioGroup>
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

export { RadioGroupField, type RadioGroupFieldOption, type RadioGroupFieldProps };
