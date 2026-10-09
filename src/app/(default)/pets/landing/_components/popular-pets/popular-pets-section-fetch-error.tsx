'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryLandingPopularPetsAction } from '@/entities/landing/landing.actions';

type PopularPetsSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function PopularPetsSectionFetchError({ description }: PopularPetsSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryLandingPopularPetsAction}
      title="دریافت حیوانات پرطرفدار انجام نشد"
    />
  );
}
