'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingPopularBrandsAction } from '@/entities/landing/landing.actions';

export function PopularBrandsSectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryLandingPopularBrandsAction}
      title="دریافت برندهای محبوب انجام نشد"
    />
  );
}
