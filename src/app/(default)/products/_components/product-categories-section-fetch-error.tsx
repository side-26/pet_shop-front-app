'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type ProductCategoriesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function ProductCategoriesSectionFetchError({
  description,
}: ProductCategoriesSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی محصولات انجام نشد"
    />
  );
}
