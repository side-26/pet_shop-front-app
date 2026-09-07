'use client';

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';

import { ShowcaseSection } from './showcase-section';

const pets = [
  { label: 'سگ', value: 'dog' },
  { label: 'گربه', value: 'cat' },
  { label: 'پرنده', value: 'bird' },
];

export function ComboboxShowcase() {
  return (
    <ShowcaseSection
      id="combobox"
      title="Combobox"
      description="جست‌وجو و انتخاب با رنگ و اندازهٔ معنایی."
    >
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        {(['primary', 'success', 'error'] as const).map((color) => (
          <Combobox key={color} items={pets} color={color} size={color === 'primary' ? 'md' : 'sm'}>
            <div className="tw:relative">
              <ComboboxInput aria-label={`انتخاب حیوان ${color}`} placeholder="جست‌وجوی حیوان" />
              <ComboboxTrigger aria-label="باز کردن گزینه‌ها" />
            </div>
            <ComboboxContent>
              <ComboboxEmpty>گزینه‌ای پیدا نشد.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxCollection>
                  {(pet) => (
                    <ComboboxItem key={pet.value} value={pet.value}>
                      {pet.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ))}
      </div>
    </ShowcaseSection>
  );
}
