import { NeshanMapPointerIcon } from '@/components/ui/map/neshan-map/plugins/icons/pointer';

import { ShowcaseSection } from './showcase-section';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function NeshanMapPointerIconShowcase() {
  return (
    <ShowcaseSection
      id="neshan-map-pointer-icons"
      title="Neshan Map Pointer Icon"
      description="نشانگر مکان نقشه با رنگ اصلی و اندازه‌های قابل‌استفاده در افزونه‌های نقشه."
    >
      <div
        className="tw:flex tw:flex-wrap tw:items-end tw:gap-6"
        role="group"
        aria-label="اندازه‌های نشانگر نقشه"
      >
        {sizes.map((size) => (
          <div key={size} className="tw:flex tw:flex-col tw:items-center tw:gap-2">
            <NeshanMapPointerIcon.Root size={size} aria-label={`نشانگر ${size}`} />
            <span className="tw:text-label-s tw:text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  );
}
