'use client';

import { PlusIcon, TagIcon, XIcon } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { tv, type VariantProps } from 'tailwind-variants';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldErrorHint } from '@/components/ui/field/field-error-hint';
import { FieldLabel } from '@/components/ui/field/label';
import { Input, type InputProps } from '@/components/ui/fields/input';
import { cn } from '@/lib/utils';

const badgeGroupFieldVariants = tv({
  slots: {
    field: 'tw:gap-2',
    label: '',
    entry: 'tw:flex tw:w-full tw:items-center tw:gap-2',
    inputWrap: 'tw:relative tw:min-w-0 tw:flex-1',
    input: 'tw:ps-10',
    prefixIcon:
      'tw:pointer-events-none tw:absolute tw:start-3 tw:top-1/2 tw:z-10 tw:size-4 tw:-translate-y-1/2 tw:text-current',
    card: 'tw:w-full',
    content: 'tw:flex tw:flex-wrap tw:items-center tw:gap-2',
    badge: 'tw:max-w-full tw:pe-1',
    remove:
      'tw:inline-flex tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:text-current tw:opacity-70 tw:transition-[background-color,opacity,transform] tw:duration-150 tw:hover:bg-current/15 tw:hover:opacity-100 tw:focus-visible:opacity-100 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-current/45 tw:active:scale-90 tw:motion-reduce:transition-none',
    description: 'tw:block tw:min-h-[1lh] tw:text-muted-foreground',
  },
  variants: {
    size: {
      xs: {
        field: 'tw:gap-1',
        label: 'tw:text-label-s',
        prefixIcon: 'tw:size-3 tw:start-2',
        remove: 'tw:size-3.5',
        description: 'tw:-mt-0.5 tw:text-xs',
      },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        prefixIcon: 'tw:size-3.5 tw:start-2.5',
        remove: 'tw:size-4',
        description: 'tw:-mt-0.5 tw:text-xs',
      },
      md: {
        field: 'tw:gap-2',
        label: 'tw:text-label-m',
        prefixIcon: 'tw:size-4 tw:start-3',
        remove: 'tw:size-5',
        description: 'tw:-mt-1 tw:text-xs',
      },
      lg: {
        field: 'tw:gap-2',
        label: 'tw:text-label-l',
        prefixIcon: 'tw:size-4.5 tw:start-3.5',
        remove: 'tw:size-5.5',
        description: 'tw:-mt-1 tw:text-[13px]/[1.6]',
      },
      xl: {
        field: 'tw:gap-2.5',
        label: 'tw:text-label-l',
        prefixIcon: 'tw:size-5 tw:start-4',
        remove: 'tw:size-6',
        description: 'tw:-mt-1.5 tw:text-[13px]/[1.6]',
      },
    },
    color: {
      primary: {
        label: 'tw:text-primary',
        prefixIcon: 'tw:text-primary',
        card: 'tw:border-primary/35',
        inputWrap: 'tw:text-primary',
      },
      secondary: {
        label: 'tw:text-secondary-active',
        prefixIcon: 'tw:text-secondary-active',
        card: 'tw:border-secondary/40',
        inputWrap: 'tw:text-secondary-active',
      },
      info: {
        label: 'tw:text-info',
        prefixIcon: 'tw:text-info',
        card: 'tw:border-info/35',
        inputWrap: 'tw:text-info',
      },
      success: {
        label: 'tw:text-success',
        prefixIcon: 'tw:text-success',
        card: 'tw:border-success/35',
        inputWrap: 'tw:text-success',
      },
      warning: {
        label: 'tw:text-warning-active',
        prefixIcon: 'tw:text-warning-active',
        card: 'tw:border-warning/40',
        inputWrap: 'tw:text-warning-active',
      },
      error: {
        label: 'tw:text-error',
        prefixIcon: 'tw:text-error',
        card: 'tw:border-error/35',
        inputWrap: 'tw:text-error',
      },
    },
  },
  defaultVariants: { size: 'md', color: 'primary' },
});

type BadgeGroupItem = { title: string };
type BadgeGroupFieldColor = NonNullable<InputProps['color']>;
type BadgeGroupFieldVisualProps = Pick<BadgeProps, 'size' | 'variant'> &
  Pick<InputProps, 'color' | 'size'> &
  VariantProps<typeof badgeGroupFieldVariants>;

type BadgeGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BadgeGroupFieldVisualProps & {
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  addButtonLabel?: ReactNode;
  placeholder?: string;
  maxItems?: number;
  control?: Control<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

function BadgeGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  addButtonLabel = 'افزودن',
  className,
  color = 'primary',
  control,
  disabled,
  hint,
  id: providedId,
  label,
  maxItems,
  name,
  placeholder = 'افزودن برچسب',
  rules,
  shouldUnregister,
  size = 'md',
  variant = 'tonal',
}: BadgeGroupFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const [draft, setDraft] = useState('');
  const { field, fieldState } = useController({ control, disabled, name, rules, shouldUnregister });
  const items = (Array.isArray(field.value) ? field.value : []) as BadgeGroupItem[];
  const styles = badgeGroupFieldVariants({ color, size });
  const canAdd =
    !disabled && draft.trim().length > 0 && (maxItems === undefined || items.length < maxItems);
  const addTag = () => {
    const title = draft.trim();
    if (!canAdd || !title) return;
    field.onChange([...items, { title }]);
    setDraft('');
  };

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      data-color={color}
      data-size={size}
      className={cn(styles.field(), className)}
    >
      {label && (
        <FieldLabel htmlFor={id} className={styles.label()}>
          {label}
        </FieldLabel>
      )}
      <div className={styles.entry()}>
        <div className={styles.inputWrap()}>
          <TagIcon aria-hidden="true" className={styles.prefixIcon()} />
          <Input
            id={id}
            color={color as BadgeGroupFieldColor}
            size={size}
            disabled={disabled}
            value={draft}
            placeholder={placeholder}
            aria-describedby={descriptionId}
            aria-invalid={fieldState.invalid}
            className={styles.input()}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTag();
              }
            }}
          />
        </div>
        <Button
          type="button"
          color={color as BadgeGroupFieldColor}
          size={size}
          disabled={!canAdd}
          onClick={addTag}
        >
          <PlusIcon aria-hidden="true" />
          {addButtonLabel}
        </Button>
      </div>
      <Card variant="outlined" size={size} className={styles.card()}>
        <CardContent className={styles.content()}>
          {items.map((item, index) => (
            <Badge
              key={`${index}-${item.title}`}
              variant={variant}
              color={color as BadgeProps['color']}
              size={size}
              className={styles.badge()}
            >
              {item.title}
              <button
                type="button"
                className={styles.remove()}
                disabled={disabled}
                aria-label={`حذف برچسب ${item.title}`}
                onClick={() => field.onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              >
                <XIcon aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </CardContent>
      </Card>
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

export { BadgeGroupField, badgeGroupFieldVariants, type BadgeGroupFieldProps, type BadgeGroupItem };
