'use client';

import { useState } from 'react';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';
import { Button } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

function FailedFetchExample({ shouldFail }: Readonly<{ shouldFail: boolean }>) {
  if (shouldFail) throw new Error('Fetch error section showcase failure');

  return <p className="tw:text-sm tw:text-muted-foreground">دریافت اطلاعات با موفقیت انجام شد.</p>;
}

const FetchErrorSectionBoundary = createFetchErrorSectionBoundary<{
  recover: () => void;
}>({
  description: 'فهرست نژادها در دسترس نیست. دوباره تلاش کنید.',
  onRetry: ({ recover }, retry) => {
    recover();
    retry();
  },
  title: 'خطا در دریافت نژادها',
});

export function FetchErrorSectionBoundaryShowcase() {
  const [shouldFail, setShouldFail] = useState(true);

  return (
    <ShowcaseSection
      id="fetch-error-section-boundary"
      title="Fetch Error Section Boundary"
      description="بازیابی بخش‌های وابسته به API با اقدام مستقل برای دریافت دوباره داده یا بارگذاری کامل صفحه."
    >
      <div className="tw:space-y-4">
        <Button type="button" variant="outlined" onClick={() => setShouldFail(true)}>
          شبیه‌سازی خطای دریافت
        </Button>
        <FetchErrorSectionBoundary recover={() => setShouldFail(false)}>
          <FailedFetchExample shouldFail={shouldFail} />
        </FetchErrorSectionBoundary>
      </div>
    </ShowcaseSection>
  );
}
