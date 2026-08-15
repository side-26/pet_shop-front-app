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
import { Checkbox, type CheckboxProps } from './checkbox';
import { selectionFieldVariants } from './selection-field.styles';

type CheckboxFieldProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
> = Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'id' | 'name' | 'onCheckedChange'> & {
  name: N;
  label: ReactNode;
  hint?: ReactNode;
  control?: Control<T>;
  rules?: Omit<RegisterOptions<T, N>, 'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'>;
  shouldUnregister?: boolean;
};

function CheckboxField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
  name,
  label,
  hint,
  control,
  rules,
  shouldUnregister,
  disabled,
  readOnly,
  size = 'md',
  ...props
}: CheckboxFieldProps<T, N>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController({ name, control, rules, shouldUnregister, disabled });
  const styles = selectionFieldVariants({ size });
  const message = fieldState.error?.message ?? hint;
  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={styles.field()}
    >
      <div className={styles.controlRow()}>
        <Checkbox
          {...props}
          id={id}
          name={field.name}
          inputRef={field.ref}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          onBlur={field.onBlur}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          aria-invalid={fieldState.invalid}
          aria-describedby={descriptionId}
        />
        <FieldLabel htmlFor={id} className={styles.label()}>
          {label}
        </FieldLabel>
      </div>
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

export { CheckboxField, type CheckboxFieldProps };
