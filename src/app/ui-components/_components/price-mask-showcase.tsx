'use client';

import { BadgeDollarSign } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';

import { ShowcaseSection } from './showcase-section';

type PriceFormValues = {
  disabledPrice: number | null;
  price: number | null;
  priceLg: number | null;
  priceMd: number | null;
  priceSm: number | null;
  priceXl: number | null;
  priceXs: number | null;
  tomanPrice: number | null;
};

const sizeExamples = [
  ['priceXs', 'xs', 'خیلی کوچک'],
  ['priceSm', 'sm', 'کوچک'],
  ['priceMd', 'md', 'متوسط'],
  ['priceLg', 'lg', 'بزرگ'],
  ['priceXl', 'xl', 'خیلی بزرگ'],
] as const;

export function PriceMaskShowcase() {
  return (
    <ShowcaseSection
      id="price-mask-fields"
      title="Price Mask / Price Mask Field"
      description="جداسازی سه‌رقمی قیمت با مقدار عددی خام برای فرم‌ها و افزونه‌های قابل تنظیم."
    >
      <Form<PriceFormValues>
        handleSubmit={() => undefined}
        options={{
          defaultValues: {
            price: 2_333_333,
            tomanPrice: 89_988,
            disabledPrice: 1_250_000,
            priceXs: 1_250,
            priceSm: 12_500,
            priceMd: 125_000,
            priceLg: 1_250_000,
            priceXl: 12_500_000,
          },
        }}
        className="tw:grid tw:gap-4 tw:md:grid-cols-3"
      >
        <PriceMaskField<PriceFormValues>
          name="price"
          label="قیمت پیش‌فرض"
          hint="مقدار فرم بدون جداکننده ذخیره می‌شود."
        />
        <PriceMaskField<PriceFormValues>
          name="tomanPrice"
          label="قیمت سفارشی"
          prefix="تومان"
          postfixIcon={<BadgeDollarSign aria-hidden="true" />}
          color="success"
        />
        <PriceMaskField<PriceFormValues> name="disabledPrice" label="قیمت غیرفعال" disabled />
        {sizeExamples.map(([name, size, label]) => (
          <PriceMaskField<PriceFormValues> key={name} name={name} label={label} size={size} />
        ))}
      </Form>
    </ShowcaseSection>
  );
}
