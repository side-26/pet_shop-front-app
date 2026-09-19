'use client';

import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';

import type { ProductDetailViewModel } from './product-detail-data';

type ProductWeightSelectorProps = Readonly<{
  disabled?: boolean;
  idPrefix?: string;
  weights: ProductDetailViewModel['weights'];
}>;

export function ProductWeightSelector({
  disabled,
  idPrefix = 'product-weight',
  weights,
}: ProductWeightSelectorProps) {
  if (weights.length === 0) return null;

  return (
    <fieldset disabled={disabled} className="tw:flex tw:flex-col tw:gap-3">
      <legend className="tw:text-title-s">انتخاب وزن</legend>
      <RadioGroup<string>
        aria-label="انتخاب وزن"
        defaultValue={weights[0]?.id}
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
