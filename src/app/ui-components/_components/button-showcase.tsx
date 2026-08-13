import { LoaderCircle, PawPrint, Plus, Trash2 } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

const colors = [
  ['primary', 'اصلی'],
  ['secondary', 'ثانویه'],
  ['info', 'اطلاع‌رسانی'],
  ['success', 'موفقیت'],
  ['warning', 'هشدار'],
  ['error', 'خطا'],
] as const satisfies ReadonlyArray<readonly [NonNullable<ButtonProps['color']>, string]>;

const variants = [
  ['fill', 'توپر'],
  ['outlined', 'خطی'],
  ['tonal', 'تونال'],
  ['flat', 'تخت'],
  ['text', 'متنی'],
  ['transparent', 'شفاف'],
] as const satisfies ReadonlyArray<readonly [NonNullable<ButtonProps['variant']>, string]>;

const sizes = [
  ['xs', 'خیلی کوچک'],
  ['sm', 'کوچک'],
  ['md', 'متوسط'],
  ['lg', 'بزرگ'],
  ['xl', 'خیلی بزرگ'],
] as const satisfies ReadonlyArray<readonly [NonNullable<ButtonProps['size']>, string]>;

export function ButtonShowcase() {
  return (
    <ShowcaseSection
      id="buttons"
      title="Button"
      description="کنترل‌های عملیاتی با رنگ، ظاهر، اندازه و حالت‌های تعاملی معنایی."
    >
      <ShowcaseGroup title="رنگ‌ها و ظاهرها">
        <div className="tw:flex tw:flex-col tw:gap-6">
          {colors.map(([color, colorLabel]) => (
            <div key={color} className="tw:flex tw:flex-col tw:gap-3">
              <p className="tw:text-label-m tw:text-muted-foreground">{colorLabel}</p>
              <div className="tw:flex tw:flex-wrap tw:gap-3">
                {variants.map(([variant, variantLabel]) => (
                  <Button
                    key={variant}
                    type="button"
                    color={color}
                    variant={variant}
                    data-showcase={`${color}-${variant}`}
                  >
                    {variantLabel}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ShowcaseGroup>

      <ShowcaseGroup title="اندازه‌ها">
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          {sizes.map(([size, label]) => (
            <Button key={size} type="button" size={size}>
              <PawPrint data-icon="inline-start" aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      </ShowcaseGroup>

      <ShowcaseGroup title="حالت‌ها و آیکن‌ها">
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          <Button type="button">
            <Plus data-icon="inline-start" aria-hidden="true" />
            افزودن حیوان خانگی
          </Button>
          <Button type="button" color="error" variant="tonal">
            <Trash2 data-icon="inline-start" aria-hidden="true" />
            حذف
          </Button>
          <Button type="button" disabled>
            غیرفعال
          </Button>
          <Button type="button" disabled aria-busy="true">
            <LoaderCircle
              data-icon="inline-start"
              aria-hidden="true"
              className="tw:animate-spin tw:motion-reduce:animate-none"
            />
            در حال ثبت
          </Button>
          <Button type="button" aria-invalid="true" color="error" variant="outlined">
            ورودی نامعتبر
          </Button>
          <Button type="button" iconOnly aria-label="افزودن مورد">
            <Plus aria-hidden="true" />
          </Button>
          <Button type="button" variant="transparent">
            کالای <bdi>SKU PS-2048</bdi>
          </Button>
        </div>
      </ShowcaseGroup>
    </ShowcaseSection>
  );
}

function ShowcaseGroup({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-4">
      <h3 className="tw:text-title-s">{title}</h3>
      {children}
    </div>
  );
}
