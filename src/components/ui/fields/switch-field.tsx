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
import { selectionFieldVariants } from './selection-field.styles';
import { Switch, type SwitchProps } from './switch';

type SwitchFieldProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
> = Omit<SwitchProps, 'checked' | 'defaultChecked' | 'id' | 'name' | 'onCheckedChange'> & {
  name: N;
  label: ReactNode;
  hint?: ReactNode;
  control?: Control<T>;
  rules?: Omit<RegisterOptions<T, N>, 'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'>;
  shouldUnregister?: boolean;
};

function SwitchField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>({
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
}: SwitchFieldProps<T, N>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController({ name, control, rules, shouldUnregister, disabled });
  const styles = selectionFieldVariants({ size });
  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={styles.field()}
    >
      <div className={styles.controlRow()}>
        <Switch
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

export { SwitchField, type SwitchFieldProps };
