'use client';

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { StarIcon } from 'lucide-react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { tv, type VariantProps } from 'tailwind-variants';

import { Field } from '@/components/ui/field/default';
import { FieldErrorHint } from '@/components/ui/field/field-error-hint';
import { cn } from '@/lib/utils';

const rateFieldVariants = tv({
  slots: {
    field: 'tw:gap-2',
    stars: 'tw:flex tw:items-center tw:gap-1',
    star: [
      'tw:inline-flex tw:items-center tw:justify-center tw:rounded-md tw:text-warning',
      'tw:transition-[color,transform] tw:duration-150 tw:hover:scale-110',
      'tw:focus-visible:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-warning/25',
      'tw:disabled:cursor-not-allowed tw:disabled:opacity-60 tw:motion-reduce:transition-none',
    ],
    icon: 'tw:stroke-current tw:transition-[fill] tw:duration-150 tw:motion-reduce:transition-none',
    description: 'tw:block tw:min-h-[1lh] tw:text-muted-foreground',
  },
  variants: {
    size: {
      xs: { stars: 'tw:gap-0.5', star: 'tw:size-8', icon: 'tw:size-4', description: 'tw:text-xs' },
      sm: { star: 'tw:size-9', icon: 'tw:size-[18px]', description: 'tw:text-xs' },
      md: { star: 'tw:size-10', icon: 'tw:size-5', description: 'tw:text-xs' },
      lg: { star: 'tw:size-11', icon: 'tw:size-6', description: 'tw:text-[13px]/[1.6]' },
      xl: { star: 'tw:size-12', icon: 'tw:size-7', description: 'tw:text-[13px]/[1.6]' },
    },
  },
  defaultVariants: { size: 'md' },
});

type RateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = VariantProps<typeof rateFieldVariants> & {
  name: TName;
  hint?: ReactNode;
  control?: Control<TFieldValues>;
  disabled?: boolean;
  readOnly?: boolean;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
  className?: string;
  'aria-label'?: string;
};

function getRating(value: unknown) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
    ? value
    : 0;
}

function RateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  'aria-label': ariaLabel = 'امتیاز',
  className,
  control,
  disabled,
  hint,
  name,
  readOnly,
  rules,
  shouldUnregister,
  size = 'md',
}: RateFieldProps<TFieldValues, TName>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const [hoveredRating, setHoveredRating] = useState(0);
  const { field, fieldState } = useController({
    control,
    disabled,
    name,
    rules,
    shouldUnregister,
  });
  const rating = getRating(field.value);
  const previewRating = hoveredRating || rating;
  const styles = rateFieldVariants({ size });

  const selectRating = (nextRating: number) => {
    if (disabled || readOnly) return;
    field.onChange(rating === nextRating ? 0 : nextRating);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, star: number) => {
    if (disabled || readOnly) return;
    const nextRating =
      event.key === 'ArrowRight'
        ? Math.min(5, star + 1)
        : event.key === 'ArrowLeft'
          ? Math.max(1, star - 1)
          : undefined;
    if (!nextRating) return;
    event.preventDefault();
    field.onChange(nextRating);
    document.getElementById(`${id}-star-${nextRating}`)?.focus();
  };

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(styles.field(), className)}
    >
      <div
        role="group"
        dir="ltr"
        aria-label={ariaLabel}
        aria-describedby={descriptionId}
        data-invalid={fieldState.invalid || undefined}
        data-readonly={readOnly || undefined}
        className={styles.stars()}
        onMouseLeave={() => setHoveredRating(0)}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const star = index + 1;
          const isFilled = star <= previewRating;
          const isPreviewed = hoveredRating > 0 && isFilled;
          return (
            <button
              key={star}
              id={`${id}-star-${star}`}
              ref={star === 1 ? field.ref : undefined}
              type="button"
              disabled={disabled}
              aria-label={`${star} ستاره`}
              aria-pressed={rating >= star}
              data-rating={star}
              data-preview={isPreviewed || undefined}
              className={styles.star()}
              onClick={() => selectRating(star)}
              onKeyDown={(event) => handleKeyDown(event, star)}
              onMouseEnter={() => setHoveredRating(star)}
              onBlur={field.onBlur}
            >
              <StarIcon
                aria-hidden="true"
                className={cn(
                  styles.icon(),
                  isFilled
                    ? isPreviewed
                      ? 'tw:fill-warning/40'
                      : 'tw:fill-warning'
                    : 'tw:fill-transparent',
                )}
              />
            </button>
          );
        })}
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

export { RateField, rateFieldVariants, type RateFieldProps };
