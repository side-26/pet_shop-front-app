'use client';

import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import { cn } from '@/lib/utils';

import type { ProductDetailViewModel } from './product-detail-data';

type ProductWeightSelectorProps = Readonly<{
  className?: string;
  disabled?: boolean;
  idPrefix?: string;
  onValueChange?: (weightId: string) => void;
  value?: string;
  weights: ProductDetailViewModel['weights'];
}>;

export function ProductWeightSelector({
  className,
  disabled,
  idPrefix = 'product-weight',
  onValueChange,
  value,
  weights,
}: ProductWeightSelectorProps) {
  if (weights.length === 0) return null;

  return (
    <fieldset disabled={disabled} className={cn('tw:flex tw:flex-col tw:gap-3', className)}>
      <legend className="tw:text-title-s">انتخاب وزن</legend>
      <RadioGroup<string>
        aria-label="انتخاب وزن"
        {...(value === undefined ? { defaultValue: weights[0]?.id } : { value, onValueChange })}
        className="tw:flex tw:flex-wrap tw:gap-2"
      >
        {weights.map((weight) => {
          const id = `${idPrefix}-${weight.id}`;
          return (
            <Badge
              key={weight.id}
              color="primary"
              size="md"
              variant="outlined"
              render={<label htmlFor={id} />}
              className="tw:cursor-pointer tw:has-[[data-checked]]:bg-primary-muted tw:has-[[data-checked]]:text-primary-muted-foreground"
            >
              <RadioGroupItem id={id} value={weight.id} className="tw:sr-only" />
              {weight.label}
            </Badge>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
