'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type CategoriesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function CategoriesSectionFetchError({ description }: CategoriesSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی حیوانات انجام نشد"
    />
  );
}
