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
import { Textarea, type TextareaProps } from '@/components/ui/fields/textarea';
import { cn } from '@/lib/utils';

const textareaFieldVariants = tv({
  slots: {
    field: 'tw:relative',
    label: '',
    textareaWrap: 'tw:relative',
    icon: 'tw:pointer-events-none tw:absolute tw:top-3 tw:flex tw:items-center tw:justify-center tw:[&_svg]:size-full',
    counter:
      'tw:pointer-events-none tw:absolute tw:bottom-2 tw:left-3 tw:rounded-md tw:bg-background/85 tw:px-1 tw:text-muted-foreground tw:tabular-nums tw:supports-backdrop-filter:backdrop-blur-sm',
    description: 'tw:block tw:min-h-[1lh]',
  },
  variants: {
    color: {
      primary: { icon: 'tw:text-primary' },
      secondary: { icon: 'tw:text-secondary-active' },
      info: { icon: 'tw:text-info' },
      success: { icon: 'tw:text-success' },
      warning: { icon: 'tw:text-warning-active' },
      error: { icon: 'tw:text-error' },
    },
    size: {
      xs: {
        field: 'tw:gap-1',
        label: 'tw:text-label-s',
        icon: 'tw:start-2 tw:size-3',
        counter: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
        textareaWrap: 'tw:[&_textarea]:ps-7',
      },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        icon: 'tw:start-2.5 tw:size-3.5',
        counter: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
        textareaWrap: 'tw:[&_textarea]:ps-8',
      },
      md: {
        field: 'tw:gap-2',
        label: 'tw:text-label-m',
        icon: 'tw:start-3 tw:size-4',
        counter: 'tw:text-label-s',
        description: 'tw:-mt-1 tw:text-xs',
        textareaWrap: 'tw:[&_textarea]:ps-9',
      },
      lg: {
        field: 'tw:gap-2',
        label: 'tw:text-label-l',
        icon: 'tw:start-3.5 tw:size-4.5',
        counter: 'tw:text-body-s',
        description: 'tw:-mt-1 tw:text-[13px]/[1.6]',
        textareaWrap: 'tw:[&_textarea]:ps-10',
      },
      xl: {
        field: 'tw:gap-2.5',
        label: 'tw:text-label-l',
        icon: 'tw:start-4 tw:size-5',
        counter: 'tw:text-body-s',
        description: 'tw:-mt-1.5 tw:text-[13px]/[1.6]',
        textareaWrap: 'tw:[&_textarea]:ps-11',
      },
    },
  },
  defaultVariants: { color: 'primary', size: 'md' },
});

const colorClasses = {
  primary: 'tw:text-primary',
  secondary: 'tw:text-secondary-active',
  info: 'tw:text-info',
  success: 'tw:text-success',
  warning: 'tw:text-warning-active',
  error: 'tw:text-error',
} as const;

type TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextareaProps,
  'color' | 'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'size' | 'value'
> &
  VariantProps<typeof textareaFieldVariants> & {
    name: TName;
    label: ReactNode;
    hint?: ReactNode;
    prefixIcon?: ReactNode;
    postfixIcon?: ReactNode;
    counter?: boolean;
    control?: Control<TFieldValues>;
    rules?: Omit<
      RegisterOptions<TFieldValues, TName>,
      'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
    >;
    shouldUnregister?: boolean;
  };

function TextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  color = 'primary',
  control,
  counter = false,
  disabled,
  hint,
  id: providedId,
  label,
  maxLength,
  name,
  postfixIcon,
  prefixIcon,
  rules,
  shouldUnregister,
  size = 'md',
  ...props
}: TextareaFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const counterId = `${id}-counter`;
  const { field, fieldState } = useController({ control, disabled, name, rules, shouldUnregister });
  const value = typeof field.value === 'string' ? field.value : '';
  const message = fieldState.error?.message ?? hint;
  const styles = textareaFieldVariants({ color, size });

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={styles.field()}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        <span className={fieldState.invalid ? 'tw:text-error' : colorClasses[color]}>{label}</span>
      </FieldLabel>
      <div className={styles.textareaWrap()}>
        {prefixIcon && (
          <span aria-hidden="true" className={styles.icon()}>
            {prefixIcon}
          </span>
        )}
        <Textarea
          {...props}
          {...field}
          id={id}
          color={color}
          size={size}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={fieldState.invalid}
          aria-describedby={cn(descriptionId, counter && counterId)}
          className={cn(counter && 'tw:pb-8', className)}
        />
        {postfixIcon && (
          <span aria-hidden="true" className={cn(styles.icon(), 'tw:start-auto tw:end-3')}>
            {postfixIcon}
          </span>
        )}
        {counter && (
          <span id={counterId} className={styles.counter()} dir="ltr" aria-live="polite">
            {value.length}
            {typeof maxLength === 'number' ? ` / ${maxLength}` : ''}
          </span>
        )}
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

export { TextareaField, textareaFieldVariants, type TextareaFieldProps };
