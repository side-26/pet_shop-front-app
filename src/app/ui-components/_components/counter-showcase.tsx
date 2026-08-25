import { Counter, type CounterProps } from '@/components/ui/counter';

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
  return (
    <ShowcaseSection
      id="counters"
      title="Counter"
      description="شمارنده کنترل‌شده یا مستقل با مقدار اولیه، حداقل و حداکثر، اندازه‌ها، ظاهرها و رنگ‌های معنایی."
    >
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
