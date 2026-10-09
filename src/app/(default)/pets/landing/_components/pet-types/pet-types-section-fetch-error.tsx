'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type PetTypesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function PetTypesSectionFetchError({ description }: PetTypesSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی‌ها انجام نشد"
    />
  );
}
