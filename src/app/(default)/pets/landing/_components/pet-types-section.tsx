import { Suspense } from 'react';

import { getAllLandingPetTypes } from '@/entities/landing/landing.service';

import { PetTypesSectionContainer } from './pet-types-section-container';
import { PetTypesSectionRenderer } from './pet-types-section-renderer';
import { petTypesSectionSkeletonData } from './pet-types-section-skeleton-data';

export function PetTypesSection() {
  const petTypesPromise = getAllLandingPetTypes();

  return (
    <section
      id="pet-types"
      aria-labelledby="pet-types-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:mb-6 tw:flex tw:flex-col tw:gap-2 tw:md:mb-8">
        <h2 id="pet-types-title" className="tw:text-title-l tw:md:text-heading-1">
          دسته‌بندی حیوانات
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          حیوان خانگی مورد علاقه خود را بر اساس دسته‌بندی جستجو کنید
        </p>
      </div>

      <Suspense
        fallback={<PetTypesSectionRenderer petTypes={petTypesSectionSkeletonData} isSkeleton />}
      >
        <PetTypesSectionContainer petTypesPromise={petTypesPromise} />
      </Suspense>
    </section>
  );
}
