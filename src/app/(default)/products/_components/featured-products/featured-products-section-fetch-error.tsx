'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingPopularProductsAction } from '@/entities/landing/landing.actions';

export function FeaturedProductsSectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryLandingPopularProductsAction}
      title="دریافت محصولات محبوب انجام نشد"
    />
  );
}
