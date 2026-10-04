'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import { APP_CURRENCY } from '@/configs/currency';
import { cn } from '@/lib/utils';

import { Price, type PriceProps } from './price';

export type AnimatedPriceProps = Omit<PriceProps, 'number'> & {
  /** A non-negative finite amount. Missing or invalid amounts render `emptyValue`. */
  number?: number | null;
  /** Content rendered when `number` is missing or invalid. Defaults to `-`. */
  emptyValue?: ReactNode;
  /** Continuously rolls the digits while the price is being fetched. */
  isLoading?: boolean;
};

const priceFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 20,
  useGrouping: true,
});
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const digitHeight = 1.08;

function AnimatedDigit({
  digit,
  index,
  isLoading,
}: Readonly<{ digit: number; index: number; isLoading: boolean }>) {
  return (
    <span
      aria-hidden="true"
      className="tw:inline-flex tw:h-[1.08em] tw:w-[0.62em] tw:overflow-hidden tw:align-baseline"
    >
      <motion.span
        initial={{ y: 0 }}
        animate={
          isLoading
            ? { y: ['0em', `-${9 * digitHeight}em`, '0em'] }
            : { y: `-${digit * digitHeight}em` }
        }
        transition={
          isLoading
            ? { duration: 1.1, delay: index * 0.07, ease: 'easeInOut', repeat: Infinity }
            : { duration: 0.5, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }
        }
        className="tw:flex tw:w-full tw:flex-col tw:items-center tw:leading-[1.08]"
      >
        {Array.from(persianDigits).map((value) => (
          <span
            key={value}
            className="tw:flex tw:h-[1.08em] tw:w-full tw:items-center tw:justify-center"
          >
            {value}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * The animated counterpart to `Price`: each Persian digit rolls like a cash
 * register whenever its value changes. It uses `Price` without animation when
 * the user prefers reduced motion.
 */
function isValidPrice(number: AnimatedPriceProps['number']): number is number {
  return typeof number === 'number' && Number.isFinite(number) && number >= 0;
}

function AnimatedPrice({
  number,
  emptyValue = '-',
  isLoading = false,
  className,
  ...props
}: AnimatedPriceProps) {
  const reduceMotion = useReducedMotion();
  const hasPrice = isValidPrice(number);

  if (reduceMotion && hasPrice && !isLoading) {
    return <Price number={number} className={className} {...props} />;
  }

  if (!hasPrice && !isLoading) {
    return (
      <span
        data-slot="animated-price"
        data-currency={APP_CURRENCY}
        className={cn('tw:inline-flex tw:items-baseline tw:gap-1 tw:whitespace-nowrap', className)}
        {...props}
      >
        {emptyValue}
      </span>
    );
  }

  const formattedNumber = priceFormatter.format(Math.floor(hasPrice ? number : 0));

  return (
    <span
      data-slot="animated-price"
      data-currency={APP_CURRENCY}
      data-loading={isLoading || undefined}
      aria-busy={isLoading || undefined}
      className={cn('tw:inline-flex tw:items-baseline tw:gap-1 tw:whitespace-nowrap', className)}
      {...props}
    >
      <bdi
        dir="ltr"
        aria-label={isLoading ? 'در حال دریافت قیمت' : formattedNumber}
        className="tw:inline-flex tw:items-baseline tw:leading-[1.08]"
      >
        {Array.from(formattedNumber).map((character, index) => {
          const digit = persianDigits.indexOf(character);

          return digit === -1 ? (
            <span key={`${character}-${index}`} aria-hidden="true" className="tw:leading-[1.08]">
              {character}
            </span>
          ) : (
            <AnimatedDigit key={index} digit={digit} index={index} isLoading={isLoading} />
          );
        })}
      </bdi>
      <span>{APP_CURRENCY}</span>
    </span>
  );
}

export { AnimatedPrice };
