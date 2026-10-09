'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryLandingRecentPetsAction } from '@/entities/landing/landing.actions';

type RehomingSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function RehomingSectionFetchError({ description }: RehomingSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryLandingRecentPetsAction}
      title="دریافت حیوانات آماده واگذاری انجام نشد"
    />
  );
}
