'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryLandingPopularBrandsAction } from '@/entities/landing/landing.actions';

export function PopularBrandsSectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryLandingPopularBrandsAction}
      title="دریافت برندهای محبوب انجام نشد"
    />
  );
}
