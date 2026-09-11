'use client';

import { useState } from 'react';

import { RangedDatePicker, type RangedDatePickerValue } from '@/components/ui/ranged-date-picker';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

type Values = {
  from: string;
  to: string;
  disabledFrom: string;
  disabledTo: string;
};

const exampleRange = {
  from: '2026-09-01T00:00:00.000Z',
  to: '2026-09-07T23:59:59.000Z',
};

export function RangedDatePickerShowcase() {
  const [range, setRange] = useState(exampleRange);

  return (
    <ShowcaseSection
      id="ranged-date-picker"
      title="Ranged Date Picker"
      description="انتخاب بازه جلالی با خروجی ISO برای فیلترهای گزارش و داشبورد."
    >
      <Form<Values>
        handleSubmit={() => undefined}
        options={{
          defaultValues: {
            ...exampleRange,
            disabledFrom: exampleRange.from,
            disabledTo: exampleRange.to,
          },
        }}
      >
        <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <RangedDatePicker<Values>
              fromDateKey="from"
              toDateKey="to"
              label="بازه گزارش"
              hint="ابتدا تاریخ شروع و سپس تاریخ پایان را انتخاب کنید."
              hasTime
              onValueChange={setRange}
            />
            <p className="tw:text-body-s tw:text-muted-foreground" dir="ltr">
              {range.from} — {range.to}
            </p>
          </div>
          <RangedDatePicker<Values>
            fromDateKey="disabledFrom"
            toDateKey="disabledTo"
            label="بازه غیرفعال"
            disabled
            color="secondary"
            defaultValue={exampleRange}
          />
        </div>
      </Form>
    </ShowcaseSection>
  );
}
