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
import { FieldErrorHint } from '@/components/ui/field/field-error-hint';
import { FieldLabel } from '@/components/ui/field/label';
import { PriceMask, type PriceMaskProps } from '@/components/ui/fields/price-mask';
import { textFieldVariants } from '@/components/ui/fields/text-field';

type PriceMaskFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<PriceMaskProps, 'defaultValue' | 'name' | 'onBlur' | 'onValueChange' | 'value'> & {
  control?: Control<TFieldValues>;
  hint?: ReactNode;
  label: ReactNode;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
};

function PriceMaskField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  color = 'primary',
  control,
  disabled,
  hint,
  id: providedId,
  label,
  name,
  rules,
  shouldUnregister,
  size = 'md',
  ...props
}: PriceMaskFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const { field: controllerField, fieldState } = useController({
    control,
    disabled,
    name,
    rules,
    shouldUnregister,
  });
  const {
    name: fieldName,
    onBlur: handleBlur,
    onChange: handleValueChange,
    ref: fieldRef,
    value: fieldValue,
  } = controllerField;
  const styles = textFieldVariants({ color, size });

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={styles.field()}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        {label}
      </FieldLabel>
      <PriceMask
        {...props}
        ref={fieldRef}
        id={id}
        name={fieldName}
        color={color}
        size={size}
        disabled={disabled}
        value={typeof fieldValue === 'number' ? fieldValue : null}
        aria-invalid={fieldState.invalid}
        aria-describedby={descriptionId}
        onBlur={handleBlur}
        onValueChange={handleValueChange}
      />
      <FieldErrorHint
        id={descriptionId}
        error={fieldState.error?.message}
        hint={hint}
        invalid={fieldState.invalid}
        className={styles.description()}
        textClassName="tw:text-muted-foreground"
      />
    </Field>
  );
}

export { PriceMaskField, type PriceMaskFieldProps };
