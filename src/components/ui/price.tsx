import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type PricePrefix = '$' | 'ریال' | 'تومان';

type PriceProps = Omit<ComponentProps<'span'>, 'children'> & {
  number: number;
  prefix: PricePrefix;
};

const priceFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 20,
  useGrouping: true,
});

function Price({ number, prefix, className, ...props }: PriceProps) {
  const formattedNumber = priceFormatter.format(number);
  const isDollar = prefix === '$';

  return (
    <span
      data-slot="price"
      data-prefix={prefix}
      className={cn('tw:inline-flex tw:items-baseline tw:gap-1 tw:whitespace-nowrap', className)}
      {...props}
    >
      {isDollar ? <span aria-hidden="true">{prefix}</span> : null}
      <bdi dir="ltr">{formattedNumber}</bdi>
      {!isDollar ? <span>{prefix}</span> : null}
    </span>
  );
}

export { Price, type PricePrefix, type PriceProps };
