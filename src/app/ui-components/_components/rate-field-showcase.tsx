'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { RateField } from '@/components/ui/fields/rate-field';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

type RatingValues = {
  rating: number;
  ratingLg: number;
  ratingMd: number;
  ratingSm: number;
  ratingXl: number;
  ratingXs: number;
};

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function RateFieldShowcase() {
  const [submittedRating, setSubmittedRating] = useState<number>();

  return (
    <ShowcaseSection
      id="rate-fields"
      title="Rate Field"
      description="امتیازدهی پنج‌ستاره با انتخاب قابل‌تغییر، پیش‌نمایش اشاره‌گر و اتصال مستقیم به React Hook Form."
    >
      <Form<RatingValues>
        handleSubmit={(values) => setSubmittedRating(values.rating)}
        options={{
          defaultValues: {
            rating: 0,
            ratingXs: 1,
            ratingSm: 2,
            ratingMd: 3,
            ratingLg: 4,
            ratingXl: 5,
          },
        }}
        className="tw:max-w-xl"
      >
        <RateField<RatingValues>
          name="rating"
          hint="برای ثبت نظر، از یک تا پنج ستاره انتخاب کنید."
          rules={{ validate: (value) => value > 0 || 'انتخاب امتیاز الزامی است.' }}
        />
        <Button type="submit">ثبت امتیاز</Button>
      </Form>
      <p role="status" className="tw:text-body-m tw:text-muted-foreground">
        امتیاز ثبت‌شده: {submittedRating?.toLocaleString('fa-IR') ?? '—'}
      </p>
      <Form<RatingValues>
        handleSubmit={() => undefined}
        options={{
          defaultValues: {
            rating: 0,
            ratingXs: 1,
            ratingSm: 2,
            ratingMd: 3,
            ratingLg: 4,
            ratingXl: 5,
          },
        }}
        className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2"
      >
        {sizes.map((size) => (
          <RateField<RatingValues>
            key={size}
            name={`rating${size.charAt(0).toUpperCase()}${size.slice(1)}` as keyof RatingValues}
            size={size}
            hint={`اندازه ${size}`}
            aria-label={`امتیاز با اندازه ${size}`}
          />
        ))}
      </Form>
    </ShowcaseSection>
  );
}
