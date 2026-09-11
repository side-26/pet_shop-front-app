'use client';

import { useState } from 'react';

import { ApiSectionErrorFallback } from '@/components/common/api-section-error-fallback';

import { ShowcaseSection } from './showcase-section';

export function ApiSectionErrorFallbackShowcase() {
  const [retryCount, setRetryCount] = useState(0);

  return (
    <ShowcaseSection
      id="api-section-error-fallback"
      title="API Section Error Fallback"
      description="بازیابی بخش‌های وابسته به API با اقدام مستقل برای دریافت دوباره داده یا بارگذاری کامل صفحه."
    >
      <ApiSectionErrorFallback
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
