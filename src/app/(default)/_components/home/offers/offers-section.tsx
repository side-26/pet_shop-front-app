import { Flame } from 'lucide-react';
import { Suspense } from 'react';

import { getDiscountedLandingProducts } from '@/entities/landing/landing.service';

import { OffersSectionContainer } from './offers-section-container';
import { OffersSectionErrorBoundary } from './offers-section-error-boundary';
import { OffersSectionRenderer } from './offers-section-renderer';
import { offersSectionSkeletonData } from './offers-section-skeleton-data';
import { RevealItem, RevealSection } from '../shared/motion-primitives';

export function OffersSection() {
  const productsPromise = getDiscountedLandingProducts({ limit: 5 });

  return (
    <RevealSection
      labelledBy="offers-title"
      className="tw:relative tw:overflow-hidden tw:bg-surface tw:py-16 tw:lg:py-24"
    >
      <div className="tw:absolute tw:start-0 tw:top-0 tw:size-64 tw:-translate-y-1/2 tw:rounded-full tw:bg-primary/10 tw:blur-3xl" />
      <div className="tw:relative tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8 tw:px-4 tw:sm:px-6 tw:md:px-8">
        <RevealItem className="tw:flex tw:items-center tw:gap-3">
          <span className="tw:flex tw:size-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-error-muted tw:text-error-muted-foreground">
            <Flame aria-hidden="true" className="tw:size-6" />
          </span>
          <div className="tw:flex tw:flex-col tw:gap-1">
            <span className="tw:text-label-m tw:font-bold tw:text-error">فرصت محدود</span>
            <h2 id="offers-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              پیشنهادهای شگفت‌انگیز
            </h2>
          </div>
        </RevealItem>

        <RevealItem>
          <Suspense
            fallback={<OffersSectionRenderer products={offersSectionSkeletonData} isSkeleton />}
          >
            <OffersSectionErrorBoundary>
              <OffersSectionContainer productsPromise={productsPromise} />
            </OffersSectionErrorBoundary>
          </Suspense>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
