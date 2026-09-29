'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function CheckoutAddressSelectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the checkout address selection.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش نشانی‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت نشانی‌ها انجام نشد"
    />
  );
}

export const CheckoutAddressSelectionErrorBoundary = catchError(
  CheckoutAddressSelectionErrorFallback,
);
