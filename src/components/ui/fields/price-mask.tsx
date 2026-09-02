'use client';

import { DollarSign } from 'lucide-react';
import { forwardRef, useState, type ChangeEvent, type ReactNode, type Ref } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Input, type InputProps } from '@/components/ui/fields/input';
import { cn } from '@/lib/utils';

const priceMaskVariants = tv({
  slots: {
    root: 'tw:relative tw:flex tw:items-center',
    input: 'tw:text-center tw:tabular-nums',
    prefix:
      'tw:pointer-events-none tw:absolute tw:start-0 tw:flex tw:h-full tw:items-center tw:justify-center tw:text-muted-foreground tw:[&_svg]:shrink-0',
    postfix:
      'tw:pointer-events-none tw:absolute tw:end-0 tw:flex tw:h-full tw:items-center tw:justify-center tw:whitespace-nowrap tw:text-muted-foreground',
  },
  variants: {
    size: {
      xs: {
        input: 'tw:px-12',
        prefix: 'tw:w-8 tw:text-[10px] tw:[&_svg]:size-3',
        postfix: 'tw:px-2 tw:text-xs',
      },
      sm: {
        input: 'tw:px-14',
        prefix: 'tw:w-9 tw:text-xs tw:[&_svg]:size-3.5',
        postfix: 'tw:px-2.5 tw:text-xs',
      },
      md: {
        input: 'tw:px-16',
        prefix: 'tw:w-10 tw:text-xs tw:[&_svg]:size-4',
        postfix: 'tw:px-3 tw:text-label-m',
      },
      lg: {
        input: 'tw:px-18',
        prefix: 'tw:w-11 tw:text-label-s tw:[&_svg]:size-4.5',
        postfix: 'tw:px-3.5 tw:text-label-m',
      },
      xl: {
        input: 'tw:px-20',
        prefix: 'tw:w-12 tw:text-label-m tw:[&_svg]:size-5',
        postfix: 'tw:px-4 tw:text-label-l',
      },
    },
  },
  defaultVariants: { size: 'md' },
});

const localizedDigits: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

function extractPriceDigits(value: string) {
  return Array.from(value)
    .map((character) => localizedDigits[character] ?? character)
    .join('')
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '');
}

function formatPriceMask(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '';
  const digits = extractPriceDigits(String(value));
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

type PriceMaskVisualProps = VariantProps<typeof priceMaskVariants>;

type PriceMaskProps = Omit<
  InputProps,
  'defaultValue' | 'dir' | 'inputMode' | 'onChange' | 'size' | 'type' | 'value'
> &
  PriceMaskVisualProps & {
    defaultValue?: number | null;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onValueChange?: (value: number | null) => void;
    postfixIcon?: ReactNode;
    prefix?: ReactNode;
    value?: number | null;
  };

function PriceMaskInner(
  {
    className,
    defaultValue = null,
    onChange,
    onValueChange,
    postfixIcon = <DollarSign aria-hidden="true" />,
    prefix = 'ریال',
    size = 'md',
    value,
    ...props
  }: PriceMaskProps,
  ref: Ref<HTMLInputElement>,
) {
  const [internalValue, setInternalValue] = useState<number | null>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const styles = priceMaskVariants({ size });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    if (event.defaultPrevented) return;

    const digits = extractPriceDigits(event.currentTarget.value);
    const nextValue = digits ? Number(digits) : null;
    if (nextValue !== null && !Number.isSafeInteger(nextValue)) return;

    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <div data-slot="price-mask" dir="ltr" className={styles.root()}>
      <span aria-hidden="true" data-slot="price-mask-prefix" className={styles.prefix()}>
        {prefix}
      </span>
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        dir="ltr"
        size={size}
        value={formatPriceMask(currentValue)}
        className={cn(styles.input(), className)}
        onChange={handleChange}
      />
      <span aria-hidden="true" data-slot="price-mask-postfix" className={styles.postfix()}>
        {postfixIcon}
      </span>
    </div>
  );
}

const PriceMask = forwardRef(PriceMaskInner);

export { PriceMask, extractPriceDigits, formatPriceMask, priceMaskVariants, type PriceMaskProps };
