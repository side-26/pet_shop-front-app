'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryCartAction } from '@/entities/users/users.actions';

export function CheckoutCartItemsFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={() => void retryCartAction()}
      title="دریافت سبد خرید انجام نشد"
    />
  );
}
