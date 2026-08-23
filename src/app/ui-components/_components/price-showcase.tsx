import { Price } from '@/components/ui/price';

import { ShowcaseSection } from './showcase-section';

export function PriceShowcase() {
  return (
    <ShowcaseSection
      id="prices"
      title="Price"
      description="نمایش قیمت با جداکننده هزارگان، جهت عددی ایزوله و واحد تومان، ریال یا دلار."
    >
      <div className="tw:flex tw:flex-wrap tw:items-baseline tw:gap-6">
        <Price number={1250000} prefix="تومان" className="tw:text-price-m tw:text-primary" />
        <Price number={9800000} prefix="ریال" className="tw:text-title-m" />
        <Price number={49.99} prefix="$" className="tw:text-title-s tw:text-success" />
      </div>
    </ShowcaseSection>
  );
}
