'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type PetTypesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function PetTypesSectionFetchError({ description }: PetTypesSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی‌ها انجام نشد"
    />
  );
}
