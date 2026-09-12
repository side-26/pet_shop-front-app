'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingRecentPetsAction } from '@/entities/landing/landing.actions';

type RehomingSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function RehomingSectionFetchError({ description }: RehomingSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryLandingRecentPetsAction}
      title="دریافت حیوانات آماده واگذاری انجام نشد"
    />
  );
}
