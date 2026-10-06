'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function OrderDetailDialogErrorFallback(_: object, { retry }: ErrorInfo) {
  return (
    <FetchErrorSectionBoundary
      description="دریافت جزئیات این سفارش ناموفق بود."
      onRetry={retry}
      title="جزئیات سفارش در دسترس نیست"
    />
  );
}

export const OrderDetailDialogErrorBoundary = catchError(OrderDetailDialogErrorFallback);
