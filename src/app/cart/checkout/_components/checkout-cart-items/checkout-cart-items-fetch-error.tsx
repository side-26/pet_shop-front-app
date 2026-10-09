'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryCartAction } from '@/entities/users/users.actions';

export function CheckoutCartItemsFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={() => void retryCartAction()}
      title="دریافت سبد خرید انجام نشد"
    />
  );
}
