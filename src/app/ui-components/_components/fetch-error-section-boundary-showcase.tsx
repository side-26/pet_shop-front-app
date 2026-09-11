'use client';

import { useState } from 'react';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

import { ShowcaseSection } from './showcase-section';

export function FetchErrorSectionBoundaryShowcase() {
  const [retryCount, setRetryCount] = useState(0);

  return (
    <ShowcaseSection
      id="fetch-error-section-boundary"
      title="Fetch Error Section Boundary"
      description="بازیابی بخش‌های وابسته به API با اقدام مستقل برای دریافت دوباره داده یا بارگذاری کامل صفحه."
    >
      <FetchErrorSectionBoundary
        description={
          retryCount === 0
            ? 'فهرست نژادها در دسترس نیست. دوباره تلاش کنید.'
            : `تلاش بازیابی شماره ${retryCount} انجام شد.`
        }
        onRetry={() => setRetryCount((count) => count + 1)}
        title="خطا در دریافت نژادها"
      />
    </ShowcaseSection>
  );
}
