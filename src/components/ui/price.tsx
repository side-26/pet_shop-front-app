import type { ComponentProps } from 'react';

import { APP_CURRENCY } from '@/configs/currency';
import { cn } from '@/lib/utils';
import { toEnglishDigits } from '@/utils/localized-digits';

type PriceProps = Omit<ComponentProps<'span'>, 'children'> & {
  number: number | string;
};

const priceFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 20,
  useGrouping: true,
});

function Price({ number, className, ...props }: PriceProps) {
  const formattedNumber = priceFormatter.format(
    Math.floor(Number(toEnglishDigits(String(number)))),
  );

  return (
    <span
      data-slot="price"
      data-currency={APP_CURRENCY}
      className={cn('tw:inline-flex tw:items-baseline tw:gap-1 tw:whitespace-nowrap', className)}
      {...props}
    >
      <bdi dir="ltr">{formattedNumber}</bdi>
      <span>{APP_CURRENCY}</span>
    </span>
  );
}

export { Price, type PriceProps };
