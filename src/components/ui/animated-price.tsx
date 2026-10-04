'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { APP_CURRENCY } from '@/configs/currency';
import { cn } from '@/lib/utils';

import { Price, type PriceProps } from './price';

export type AnimatedPriceProps = PriceProps;

const priceFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 20,
  useGrouping: true,
});
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const digitHeight = 1.08;

function AnimatedDigit({ digit, index }: Readonly<{ digit: number; index: number }>) {
  return (
    <span
      aria-hidden="true"
      className="tw:inline-flex tw:h-[1.08em] tw:w-[0.62em] tw:overflow-hidden tw:align-[-0.14em]"
    >
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: `-${digit * digitHeight}em` }}
        transition={{ duration: 0.5, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
        className="tw:flex tw:flex-col tw:leading-[1.08]"
      >
        {Array.from(persianDigits).map((value) => (
          <span key={value} className="tw:h-[1.08em]">
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
function AnimatedPrice({ number, className, ...props }: AnimatedPriceProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <Price number={number} className={className} {...props} />;
  }

  const formattedNumber = priceFormatter.format(Math.floor(number));

  return (
    <span
      data-slot="animated-price"
      data-currency={APP_CURRENCY}
      className={cn('tw:inline-flex tw:items-baseline tw:gap-1 tw:whitespace-nowrap', className)}
      {...props}
    >
      <bdi dir="ltr" aria-label={formattedNumber} className="tw:inline-flex">
        {Array.from(formattedNumber).map((character, index) => {
          const digit = persianDigits.indexOf(character);

          return digit === -1 ? (
            <span key={`${character}-${index}`} aria-hidden="true">
              {character}
            </span>
          ) : (
            <AnimatedDigit key={index} digit={digit} index={index} />
          );
        })}
      </bdi>
      <span>{APP_CURRENCY}</span>
    </span>
  );
}

export { AnimatedPrice };
