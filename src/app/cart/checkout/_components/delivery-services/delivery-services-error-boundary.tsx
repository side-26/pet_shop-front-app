'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function CheckoutDeliveryServicesErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering checkout delivery services.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش سرویس‌های ارسال خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="نمایش سرویس‌های ارسال انجام نشد"
    />
  );
}

export const CheckoutDeliveryServicesErrorBoundary = catchError(
  CheckoutDeliveryServicesErrorFallback,
);
