'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryLandingHomeOffersAction } from '@/entities/landing/landing.actions';

type OffersSectionFetchErrorProps = Readonly<{ description?: string | null }>;

export function OffersSectionFetchError({ description }: OffersSectionFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryLandingHomeOffersAction}
      title="دریافت پیشنهادها انجام نشد"
    />
  );
}
