'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

const exampleIsoValue = '2026-09-07T05:34:56.000Z';
type DatePickerShowcaseValues = {
  disabledDate: string;
  invalidDate: string;
  scheduledAt: string;
};

export function DatePickerShowcase() {
  const [acceptedValue, setAcceptedValue] = useState(exampleIsoValue);

  return (
    <ShowcaseSection
      id="date-picker"
      title="Date Picker"
      description="انتخاب تاریخ جلالی با نمایش DD/MM/YYYY HH:mm:ss و خروجی استاندارد ISO برای API."
    >
      <Form<DatePickerShowcaseValues>
        handleSubmit={() => undefined}
        options={{
          defaultValues: {
            disabledDate: '',
            invalidDate: exampleIsoValue,
            scheduledAt: exampleIsoValue,
          },
        }}
      >
        <div className="tw:grid tw:gap-6 tw:md:grid-cols-3">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <DatePicker<DatePickerShowcaseValues>
              name="scheduledAt"
              label="زمان ارسال سفارش"
              hasTime
              hint="تاریخ و زمان تحویل سفارش را انتخاب کنید."
              onValueChange={setAcceptedValue}
            />
            <p className="tw:text-body-s tw:text-muted-foreground" dir="ltr">
              ISO: {acceptedValue}
            </p>
          </div>
          <DatePicker<DatePickerShowcaseValues>
            name="disabledDate"
            label="تاریخ غیرفعال"
            hint="این فیلد در حال حاضر قابل تغییر نیست."
            disabled
            color="secondary"
            size="lg"
          />
          <div className="tw:flex tw:flex-col tw:gap-2">
            <DatePicker<DatePickerShowcaseValues>
              name="invalidDate"
              label="تاریخ نامعتبر"
              hint="برای مشاهده خطا، دکمه را انتخاب کنید."
              color="warning"
              rules={{ validate: () => 'تاریخ انتخاب‌شده معتبر نیست.' }}
            />
            <Button type="submit" size="sm" variant="outlined">
              نمایش وضعیت خطا
            </Button>
          </div>
        </div>
      </Form>
    </ShowcaseSection>
  );
}
