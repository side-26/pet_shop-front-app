import { Spinner, type SpinnerProps } from '@/components/ui/spinner';
import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<SpinnerProps['color']>>;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<SpinnerProps['size']>
>;

export function SpinnerShowcase() {
  return (
    <ShowcaseSection
      id="spinners"
      title="Spinner"
      description="نشانگر بارگذاری در همه اندازه‌ها و رنگ‌های معنایی، همراه با نام دسترس‌پذیر فارسی."
    >
      <div className="tw:grid tw:gap-5">
        {colors.map((color) => (
          <div
            key={color}
            className="tw:flex tw:items-center tw:gap-5 tw:rounded-2xl tw:border tw:border-border tw:bg-background/70 tw:p-4"
          >
            <span className="tw:w-20 tw:text-label-m tw:text-muted-foreground">{color}</span>
            {sizes.map((size) => (
              <Spinner
                key={size}
                color={color}
                size={size}
                aria-label={`در حال بارگذاری ${color} ${size}`}
              />
            ))}
          </div>
        ))}
      </div>
    </ShowcaseSection>
  );
}
