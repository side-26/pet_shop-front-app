import { Suspense } from 'react';

import { getRecentLandingPetsAction } from '@/entities/landing/landing.actions';

import { RehomingSectionContainer } from './rehoming-section-container';
import { RehomingSectionErrorBoundary } from './rehoming-section-error-boundary';
import { RehomingSectionRenderer } from './rehoming-section-renderer';
import { rehomingSectionSkeletonData } from './rehoming-section-skeleton-data';

export function RehomingSection() {
  const petsPromise = getRecentLandingPetsAction();

  return (
    <section
      aria-labelledby="rehoming-title"
      className="tw:default-layout-container tw:py-8 tw:md:py-12"
    >
      <h2 id="rehoming-title" className="tw:mb-6 tw:text-title-l tw:md:mb-8 tw:md:text-heading-2">
        حیوانات آماده واگذاری
      </h2>

      <Suspense
        fallback={<RehomingSectionRenderer pets={rehomingSectionSkeletonData} isSkeleton />}
      >
        <RehomingSectionErrorBoundary>
          <RehomingSectionContainer petsPromise={petsPromise} />
        </RehomingSectionErrorBoundary>
      </Suspense>
    </section>
  );
}
