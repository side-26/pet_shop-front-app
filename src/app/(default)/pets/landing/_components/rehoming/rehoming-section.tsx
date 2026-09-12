import { Suspense } from 'react';

import { getRecentLandingPets } from '@/entities/landing/landing.service';

import { RehomingSectionContainer } from './rehoming-section-container';
import { RehomingSectionErrorBoundary } from './rehoming-section-error-boundary';
import { RehomingSectionRenderer } from './rehoming-section-renderer';
import { rehomingSectionSkeletonData } from './rehoming-section-skeleton-data';

export function RehomingSection() {
  const petsPromise = getRecentLandingPets();

  return (
    <section
      aria-labelledby="rehoming-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
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
