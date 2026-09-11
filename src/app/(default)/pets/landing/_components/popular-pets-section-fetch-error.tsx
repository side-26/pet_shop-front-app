'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingPopularPetsAction } from '@/entities/landing/landing.actions';

type PopularPetsSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function PopularPetsSectionFetchError({ description }: PopularPetsSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryLandingPopularPetsAction}
      title="دریافت حیوانات پرطرفدار انجام نشد"
    />
  );
}
