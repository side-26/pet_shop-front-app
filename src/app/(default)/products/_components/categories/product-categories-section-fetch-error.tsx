'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type ProductCategoriesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function ProductCategoriesSectionFetchError({
  description,
}: ProductCategoriesSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی محصولات انجام نشد"
    />
  );
}
