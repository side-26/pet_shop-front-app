'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useCallback, useId, useRef, type ComponentProps, type ReactNode } from 'react';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

const inputOtpFieldVariants = tv({
  slots: {
    field: 'tw:relative',
    label: '',
    control: 'tw:w-fit',
    description: 'tw:block tw:min-h-[1lh]',
  },
  variants: {
    size: {
      xs: {
        field: 'tw:gap-1',
        label: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
      },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
      },
      md: {
        field: 'tw:gap-2',
        label: 'tw:text-label-m',
        description: 'tw:-mt-1 tw:text-xs',
      },
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

const inputOtpFieldColorClasses = {
  primary: 'tw:text-primary',
  secondary: 'tw:text-secondary-active',
  info: 'tw:text-info',
  success: 'tw:text-success',
  warning: 'tw:text-warning-active',
  error: 'tw:text-error',
} as const;

type InputOtpFieldVisualProps = VariantProps<typeof inputOtpFieldVariants>;
type InputOtpFieldColor = keyof typeof inputOtpFieldColorClasses;

type InputOtpFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  ComponentProps<typeof InputOTP>,
  | 'autoFocus'
  | 'children'
  | 'className'
  | 'color'
  | 'containerClassName'
  | 'defaultValue'
  | 'maxLength'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onComplete'
  | 'ref'
  | 'render'
  | 'size'
  | 'value'
> &
  InputOtpFieldVisualProps & {
    name: TName;
    label: ReactNode;
    color?: InputOtpFieldColor;
    hint?: ReactNode;
    className?: string;
    control?: Control<TFieldValues>;
    focusOnMount?: boolean;
    maxLength?: number;
    onFinished?: (value: string) => void;
    submitOnFinished?: boolean;
    rules?: Omit<
      RegisterOptions<TFieldValues, TName>,
      'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
    >;
    shouldUnregister?: boolean;
  };

function InputOtpField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  color = 'primary',
  control,
  disabled,
  focusOnMount = false,
  hint,
  id: providedId,
  inputMode = 'numeric',
  label,
  maxLength = 6,
  name,
  onFinished,
  pattern = REGEXP_ONLY_DIGITS,
  readOnly,
  rules,
  shouldUnregister,
  size = 'md',
  submitOnFinished = false,
  ...props
}: InputOtpFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { field, fieldState } = useController({
    control,
    disabled,
    name,
    rules,
    shouldUnregister,
  });
  const message = fieldState.error?.message ?? hint;
  const styles = inputOtpFieldVariants({ size });

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      field.ref(element);
    },
    [field],
  );

  const handleFinished = useCallback(
    (value: string) => {
      onFinished?.(value);
      if (submitOnFinished) {
        inputRef.current?.form?.requestSubmit();
      }
    },
    [onFinished, submitOnFinished],
  );

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={cn(styles.field(), className)}
    >
      <FieldLabel htmlFor={id} className={styles.label()}>
        <span className={fieldState.invalid ? 'tw:text-error' : inputOtpFieldColorClasses[color]}>
          {label}
        </span>
      </FieldLabel>
      <InputOTP
        {...props}
        ref={setInputRef}
        id={id}
        name={field.name}
        value={typeof field.value === 'string' ? field.value : ''}
        maxLength={maxLength}
        inputMode={inputMode}
        pattern={pattern}
        autoFocus={focusOnMount}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={fieldState.invalid}
        aria-describedby={descriptionId}
        onBlur={field.onBlur}
        onChange={field.onChange}
        onComplete={handleFinished}
        containerClassName={styles.control()}
      >
        <InputOTPGroup size={size} dir="ltr">
          {Array.from({ length: maxLength }, (_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              color={color}
              size={size}
              aria-invalid={fieldState.invalid}
              data-disabled={disabled || undefined}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
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

export { InputOtpField, inputOtpFieldVariants, type InputOtpFieldProps };
