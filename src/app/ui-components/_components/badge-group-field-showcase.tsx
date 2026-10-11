'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { BadgeGroupField } from '@/components/ui/fields/badge-group-field';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

type BadgeGroupValues = { tags: { title: string }[] };

export function BadgeGroupFieldShowcase() {
  const [submittedTags, setSubmittedTags] = useState<BadgeGroupValues['tags']>();

  return (
    <ShowcaseSection
      id="badge-group-fields"
      title="Badge Group Field"
      description="فهرست برچسب‌های قابل‌ویرایش با افزودن، حذف، بازخورد اعتبارسنجی و چینش واکنش‌گرا."
    >
      <Form<BadgeGroupValues>
        handleSubmit={(values) => setSubmittedTags(values.tags)}
        options={{ defaultValues: { tags: [{ title: 'سگ' }, { title: 'تغذیه' }] } }}
        className="tw:max-w-xl"
      >
        <BadgeGroupField<BadgeGroupValues>
          name="tags"
          label="برچسب‌های مقاله"
          hint="تا پنج برچسب کوتاه و مرتبط وارد کنید."
          maxItems={5}
          variant="tonal"
          color="primary"
          rules={{
            validate: (value) =>
              (Array.isArray(value) && value.length > 0) || 'حداقل یک برچسب وارد کنید.',
          }}
        />
        <Button type="submit">ثبت برچسب‌ها</Button>
      </Form>
      <p role="status" className="tw:text-body-m tw:text-muted-foreground">
        برچسب‌های ثبت‌شده: {submittedTags?.map((tag) => tag.title).join('، ') || '—'}
      </p>
    </ShowcaseSection>
  );
}
