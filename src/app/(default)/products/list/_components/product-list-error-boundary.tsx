'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function ProductListErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the product catalogue.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش فهرست محصولات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت فهرست محصولات انجام نشد"
    />
  );
}

export const ProductListErrorBoundary = catchError(ProductListErrorFallback);
