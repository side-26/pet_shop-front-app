'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function ProductCategoriesSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the products landing pet-type section.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش دسته‌بندی محصولات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت دسته‌بندی محصولات انجام نشد"
    />
  );
}

export const ProductCategoriesSectionErrorBoundary = catchError(
  ProductCategoriesSectionErrorFallback,
);
