'use client';

import { Heart, Sparkles } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { ShowcaseSection } from './showcase-section';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const variants = ['fill', 'outlined', 'tonal', 'flat', 'text', 'transparent'] as const;

export function ToggleGroupShowcase() {
  return (
    <ShowcaseSection
      id="toggle-groups"
      title="Toggle / Toggle Group"
      description="انتخاب تکی یا چندگانه Base UI با اندازه، ظاهر و رنگ معنایی مشترک و حرکت صفحه‌کلید سازگار با RTL."
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        {sizes.map((size) => (
          <Toggle key={size} size={size} aria-label={`پسندیدن در اندازه ${size}`}>
            <Heart data-icon="inline-start" aria-hidden="true" />
            {size}
          </Toggle>
        ))}
      </div>

      <div className="tw:grid tw:items-start tw:gap-4 tw:lg:grid-cols-2">
        {variants.map((variant) => (
          <ToggleGroup
            key={variant}
            aria-label={`وزن محصول · ${variant}`}
            variant={variant}
            defaultValue={['15kg']}
          >
            <ToggleGroupItem value="15kg">۱۵ کیلوگرم</ToggleGroupItem>
            <ToggleGroupItem value="4kg">۴ کیلوگرم</ToggleGroupItem>
          </ToggleGroup>
        ))}
      </div>

      <div className="tw:flex tw:flex-wrap tw:items-start tw:gap-4">
        {colors.map((color) => (
          <ToggleGroup
            key={color}
            aria-label={`ویژگی محصول · ${color}`}
            color={color}
            variant="tonal"
            defaultValue={['natural']}
            multiple
          >
            <ToggleGroupItem value="natural">
              <Sparkles data-icon="inline-start" aria-hidden="true" />
              طبیعی
            </ToggleGroupItem>
            <ToggleGroupItem value="sensitive">حساس</ToggleGroupItem>
          </ToggleGroup>
        ))}
      </div>

      <ToggleGroup
        aria-label="گروه عمودی غیرفعال"
        orientation="vertical"
        spacing={0}
        defaultValue={['available']}
      >
        <ToggleGroupItem value="available">موجود</ToggleGroupItem>
        <ToggleGroupItem value="disabled" disabled>
          غیرفعال
        </ToggleGroupItem>
      </ToggleGroup>
    </ShowcaseSection>
  );
}
