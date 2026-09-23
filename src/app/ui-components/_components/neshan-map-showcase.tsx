import { NeshanMap } from '@/components/ui/map/neshan-map/default';

import { ShowcaseSection } from './showcase-section';

export function NeshanMapShowcase() {
  return (
    <ShowcaseSection
      id="neshan-maps"
      title="Neshan Map"
      description="نقشه تعاملی نشان با پشتیبانی پیش‌فرض از برچسب‌های راست‌به‌چپ و کنترل برنامه‌نویسی‌شدهٔ موقعیت."
    >
      <NeshanMap
        aria-label="نمونه نقشه نشان تهران"
        className="tw:h-96"
        center={[51.389, 35.6892]}
      />
    </ShowcaseSection>
  );
}
