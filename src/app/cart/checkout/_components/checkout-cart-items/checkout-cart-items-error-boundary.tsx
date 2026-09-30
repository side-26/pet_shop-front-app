'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function CheckoutCartItemsErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering checkout cart items.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش کالاهای سفارش خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="نمایش سبد خرید انجام نشد"
    />
  );
}

export const CheckoutCartItemsErrorBoundary = catchError(CheckoutCartItemsErrorFallback);
