'use client';

import {
  VirtualCombobox,
  VirtualComboboxContent,
  VirtualComboboxInput,
  VirtualComboboxTrigger,
} from '@/components/ui/virtual-combobox';

import { ShowcaseSection } from './showcase-section';

const options = Array.from({ length: 1_000 }, (_, index) => ({
  label: `گزینهٔ جلالی ${index + 1}`,
  value: `jalali-option-${index + 1}`,
}));

export function VirtualSelectShowcase() {
  return (
    <ShowcaseSection
      id="virtual-select"
      title="Virtual Combobox"
      description="Combobox مشترک با فهرست مجازی برای مجموعه‌های بزرگ، بدون برچسب فیلد."
    >
      <div className="tw:w-72">
        <VirtualCombobox items={options} defaultValue={options[0].value}>
          <div className="tw:relative">
            <VirtualComboboxInput aria-label="انتخاب سال جلالی" />
            <VirtualComboboxTrigger aria-label="باز کردن گزینه‌ها" />
          </div>
          <VirtualComboboxContent />
        </VirtualCombobox>
      </div>
    </ShowcaseSection>
  );
}
