import { Suspense } from 'react';

import { getPopularLandingBrands } from '@/entities/landing/landing.service';

import { PopularBrandsSectionContainer } from './popular-brands-section-container';
import { PopularBrandsSectionErrorBoundary } from './popular-brands-section-error-boundary';
import { PopularBrandsSectionRenderer } from './popular-brands-section-renderer';
import { popularBrandsSectionSkeletonData } from './popular-brands-section-skeleton-data';

export function PopularBrandsSection() {
  const popularBrandsPromise = getPopularLandingBrands();

  return (
    <section
      id="popular-brands"
      aria-labelledby="popular-brands-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:mb-6 tw:flex tw:flex-col tw:gap-2 tw:md:mb-8">
        <h2 id="popular-brands-title" className="tw:text-title-l tw:md:text-heading-1">
          برندهای محبوب
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          برندهای پرطرفدار را برای محصولات دوست کوچک خود ببینید
        </p>
      </div>
      <Suspense
        fallback={
          <PopularBrandsSectionRenderer brands={popularBrandsSectionSkeletonData} isSkeleton />
        }
      >
        <PopularBrandsSectionErrorBoundary>
          <PopularBrandsSectionContainer popularBrandsPromise={popularBrandsPromise} />
        </PopularBrandsSectionErrorBoundary>
      </Suspense>
    </section>
  );
}
