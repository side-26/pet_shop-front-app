'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

type CategoriesSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function CategoriesSectionFetchError({ description }: CategoriesSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryAllLandingPetTypesAction}
      title="دریافت دسته‌بندی حیوانات انجام نشد"
    />
  );
}
