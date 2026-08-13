import { Badge, type BadgeProps } from '@/components/ui/badge';

import { ShowcaseSection } from './showcase-section';

const colors = [
  ['primary', 'اصلی'],
  ['secondary', 'ثانویه'],
  ['info', 'اطلاع‌رسانی'],
  ['success', 'موجود'],
  ['warning', 'رو به اتمام'],
  ['error', 'ناموجود'],
] as const satisfies ReadonlyArray<readonly [NonNullable<BadgeProps['color']>, string]>;

const variants = [
  'fill',
  'outlined',
  'tonal',
  'flat',
  'text',
  'transparent',
] as const satisfies ReadonlyArray<NonNullable<BadgeProps['variant']>>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<BadgeProps['size']>
>;

export function BadgeShowcase() {
  return (
    <ShowcaseSection
      id="badges"
      title="Badge"
      description="برچسب‌های کوتاه برای وضعیت، دسته‌بندی و اطلاعات تکمیلی بدون اتکا به رنگ به‌تنهایی."
    >
      <div className="tw:flex tw:flex-col tw:gap-6">
        {colors.map(([color, label]) => (
          <div key={color} className="tw:flex tw:flex-col tw:gap-3">
            <p className="tw:text-label-m tw:text-muted-foreground">{label}</p>
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              {variants.map((variant) => (
                <Badge
                  key={variant}
                  color={color}
                  variant={variant}
                  data-showcase={`${color}-${variant}`}
                >
                  {label} · {variant}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">اندازه‌ها و ترکیب محتوا</h3>
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          {sizes.map((size) => (
            <Badge key={size} size={size} color="success" variant="tonal">
              اندازه {size}
            </Badge>
          ))}
          <Badge aria-invalid="true" color="error" variant="outlined">
            نیازمند بررسی
          </Badge>
          <Badge render={<a href="#cards" />} color="info" variant="text">
            رفتن به کارت‌ها
          </Badge>
          <Badge variant="transparent">
            سفارش <bdi>ORD-1405-0831</bdi>
          </Badge>
        </div>
      </div>
    </ShowcaseSection>
  );
}
