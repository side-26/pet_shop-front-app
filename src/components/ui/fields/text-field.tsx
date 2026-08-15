'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
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
import { Input, type InputProps } from '@/components/ui/fields/input';
import { cn } from '@/lib/utils';

const textFieldVariants = tv({
  slots: {
    field: 'tw:relative',
    label: '',
    inputWrap: 'tw:relative tw:flex tw:items-center',
    icon: 'tw:pointer-events-none tw:absolute tw:flex tw:items-center tw:justify-center tw:text-current tw:[&_svg]:size-full',
    description: 'tw:block tw:min-h-[1lh] tw:text-muted-foreground',
    toggle:
      'tw:absolute tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:text-current tw:outline-none tw:hover:bg-current/10 tw:focus-visible:ring-2 tw:focus-visible:ring-current/25 tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:shrink-0',
  },
  variants: {
    color: {
      primary: { label: 'tw:text-primary', icon: 'tw:text-primary', toggle: 'tw:text-primary' },
      secondary: {
        label: 'tw:text-secondary-active',
        icon: 'tw:text-secondary-active',
        toggle: 'tw:text-secondary-active',
      },
      info: { label: 'tw:text-info', icon: 'tw:text-info', toggle: 'tw:text-info' },
      success: { label: 'tw:text-success', icon: 'tw:text-success', toggle: 'tw:text-success' },
      warning: {
        label: 'tw:text-warning-active',
        icon: 'tw:text-warning-active',
        toggle: 'tw:text-warning-active',
      },
      error: { label: 'tw:text-error', icon: 'tw:text-error', toggle: 'tw:text-error' },
    },
    size: {
      xs: {
        field: 'tw:gap-1',
        label: 'tw:text-label-s',
        icon: 'tw:size-3 tw:start-2',
        description: 'tw:text-body-s',
        toggle: 'tw:end-1.5 tw:size-5 tw:[&_svg]:size-3',
        inputWrap: 'tw:[&_input]:ps-7 tw:[&_input]:pe-8',
      },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        icon: 'tw:size-3.5 tw:start-2.5',
        description: 'tw:text-body-s',
        toggle: 'tw:end-1.5 tw:size-6 tw:[&_svg]:size-3.5',
        inputWrap: 'tw:[&_input]:ps-8 tw:[&_input]:pe-9',
      },
      md: {
        field: 'tw:gap-2',
        label: 'tw:text-label-m',
        icon: 'tw:size-4 tw:start-3',
        description: 'tw:text-body-s',
        toggle: 'tw:end-1.5 tw:size-8 tw:[&_svg]:size-4',
        inputWrap: 'tw:[&_input]:ps-9 tw:[&_input]:pe-11',
      },
      lg: {
        field: 'tw:gap-2',
        label: 'tw:text-label-l',
        icon: 'tw:size-4.5 tw:start-3.5',
        description: 'tw:text-body-m',
        toggle: 'tw:end-2 tw:size-9 tw:[&_svg]:size-4.5',
        inputWrap: 'tw:[&_input]:ps-10 tw:[&_input]:pe-13',
      },
      xl: {
        field: 'tw:gap-2.5',
        label: 'tw:text-label-l',
        icon: 'tw:size-5 tw:start-4',
        description: 'tw:text-body-m',
        toggle: 'tw:end-2 tw:size-10 tw:[&_svg]:size-5',
        inputWrap: 'tw:[&_input]:ps-11 tw:[&_input]:pe-14',
      },
    },
  },
  defaultVariants: { color: 'primary', size: 'md' },
});

const textFieldColorClasses = {
  primary: 'tw:text-primary',
  secondary: 'tw:text-secondary-active',
  info: 'tw:text-info',
  success: 'tw:text-success',
  warning: 'tw:text-warning-active',
  error: 'tw:text-error',
} as const;

type TextFieldVisualProps = VariantProps<typeof textFieldVariants>;

type TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  InputProps,
  'color' | 'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'size' | 'value'
> &
  TextFieldVisualProps & {
    name: TName;
    label: ReactNode;
    hint?: ReactNode;
    prefixIcon?: ReactNode;
    postfixIcon?: ReactNode;
    control?: Control<TFieldValues>;
    rules?: Omit<
      RegisterOptions<TFieldValues, TName>,
      'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
    >;
    shouldUnregister?: boolean;
  };

function TextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  color = 'primary',
  control,
  disabled,
  hint,
  id: providedId,
  label,
  name,
  postfixIcon,
  prefixIcon,
  rules,
  shouldUnregister,
  size = 'md',
  type = 'text',
  ...props
}: TextFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { field, fieldState } = useController({ control, disabled, name, rules, shouldUnregister });
  const isPassword = type === 'password';
  const message = fieldState.error?.message ?? hint;
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
        <span className={fieldState.invalid ? 'tw:text-error' : textFieldColorClasses[color]}>
          {label}
        </span>
      </FieldLabel>
      <div className={styles.inputWrap()}>
        {prefixIcon && (
          <span aria-hidden="true" className={styles.icon()}>
            {prefixIcon}
          </span>
        )}
        <Input
          {...props}
          {...field}
          id={id}
          type={isPassword ? (passwordVisible ? 'text' : 'password') : type}
          color={color}
          size={size}
          disabled={disabled}
          value={field.value ?? ''}
          aria-invalid={fieldState.invalid}
          aria-describedby={descriptionId}
          className={className}
        />
        {!isPassword && postfixIcon && (
          <span aria-hidden="true" className={cn(styles.icon(), 'tw:start-auto tw:end-3')}>
            {postfixIcon}
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            className={styles.toggle()}
            disabled={disabled}
            aria-label={passwordVisible ? 'پنهان‌کردن رمز عبور' : 'نمایش رمز عبور'}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
          </button>
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

export { TextField, textFieldVariants, type TextFieldProps };
