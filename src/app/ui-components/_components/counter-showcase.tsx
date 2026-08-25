'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Counter, type CounterProps, type CounterRef } from '@/components/ui/counter';

import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<CounterProps['color']>>;
const variants = [
  'fill',
  'outlined',
  'tonal',
  'flat',
  'text',
  'transparent',
] as const satisfies ReadonlyArray<NonNullable<CounterProps['variant']>>;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<CounterProps['size']>
>;

export function CounterShowcase() {
  const counterRef = useRef<CounterRef>(null);
  const [refValue, setRefValue] = useState<number>();

  return (
    <ShowcaseSection
      id="counters"
      title="Counter"
      description="شمارنده کنترل‌شده یا مستقل با مقدار اولیه، حداقل و حداکثر، اندازه‌ها، ظاهرها و رنگ‌های معنایی."
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <Counter ref={counterRef} defaultValue={2} min={1} max={5} aria-label="شمارنده با ref" />
        <Button variant="outlined" onClick={() => setRefValue(counterRef.current?.value)}>
          خواندن مقدار از ref
        </Button>
        {refValue !== undefined ? (
          <output dir="ltr">{refValue.toLocaleString('fa-IR')}</output>
        ) : null}
      </div>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <Counter
          defaultValue={1}
          min={0}
          max={5}
          variant="outlined"
          color="success"
          aria-label="شمارنده حذف"
        />
        <p className="tw:text-body-s tw:text-muted-foreground">
          در مقدار ۱، اقدام کاهش به حذف با آیکن سطل زباله تغییر می‌کند.
        </p>
      </div>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        {variants.map((variant) => (
          <Counter
            key={variant}
            variant={variant}
            defaultValue={2}
            min={1}
            max={5}
            aria-label={variant}
          />
        ))}
      </div>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        {colors.map((color) => (
          <Counter
            key={color}
            color={color}
            variant="tonal"
            defaultValue={2}
            min={1}
            max={5}
            aria-label={color}
          />
        ))}
      </div>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        {sizes.map((size) => (
          <Counter
            key={size}
            size={size}
            variant="outlined"
            defaultValue={2}
            min={1}
            max={5}
            aria-label={size}
          />
        ))}
      </div>
    </ShowcaseSection>
  );
}
