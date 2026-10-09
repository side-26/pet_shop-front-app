'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryLandingPopularProductsAction } from '@/entities/landing/landing.actions';

export function FeaturedProductsSectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryLandingPopularProductsAction}
      title="دریافت محصولات محبوب انجام نشد"
    />
  );
}
