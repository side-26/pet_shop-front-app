'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingHomeOffersAction } from '@/entities/landing/landing.actions';

type OffersSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function OffersSectionFetchError({ description }: OffersSectionFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryLandingHomeOffersAction}
      title="دریافت پیشنهادها انجام نشد"
    />
  );
}
