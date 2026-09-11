import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getPopularLandingPets } from '@/entities/landing/landing.service';

import { PopularPetsSectionContainer } from './popular-pets-section-container';
import { PopularPetsSectionErrorBoundary } from './popular-pets-section-error-boundary';
import { PopularPetsSectionRenderer } from './popular-pets-section-renderer';
import { popularPetsSectionSkeletonData } from './popular-pets-section-skeleton-data';

export function PopularPetsSection() {
  const petsPromise = getPopularLandingPets();

  return (
    <section
      aria-labelledby="popular-pets-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:mb-6 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:md:mb-8">
        <h2 id="popular-pets-title" className="tw:text-title-l tw:md:text-heading-2">
          پرطرفدارترین حیوانات
        </h2>
        <Link href={routePaths.petsList} className={buttonVariants({ variant: 'text' })}>
          مشاهده بیشتر
          <ArrowLeft data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>

      <Suspense
        fallback={<PopularPetsSectionRenderer pets={popularPetsSectionSkeletonData} isSkeleton />}
      >
        <PopularPetsSectionErrorBoundary>
          <PopularPetsSectionContainer petsPromise={petsPromise} />
        </PopularPetsSectionErrorBoundary>
      </Suspense>
    </section>
  );
}
