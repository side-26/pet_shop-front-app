import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { PetTypesCarouselSection } from '@/components/common/pet-types-carousel-section';
import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getAllLandingPetTypesAction } from '@/entities/landing/landing.actions';
import { cn } from '@/lib/utils';

import { CategoriesSectionContainer } from './categories-section-container';
import { CategoriesSectionErrorBoundary } from './categories-section-error-boundary';
import { categoriesSectionSkeletonData } from './categories-section-skeleton-data';
import { RevealItem, RevealSection } from '../shared/motion-primitives';

export function CategoriesSection() {
  const petTypesPromise = getAllLandingPetTypesAction();

  return (
    <RevealSection
      labelledBy="categories-title"
      className="tw:overflow-hidden tw:bg-surface tw:py-16 tw:lg:py-24"
    >
      <div className="tw:default-layout-container tw:flex tw:flex-col tw:gap-8">
        <RevealItem className="tw:flex tw:items-end tw:justify-between tw:gap-4">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <h2 id="categories-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              دسته‌بندی حیوانات
            </h2>
          </div>
          <Link
            href={routePaths.pets}
            className={cn(buttonVariants({ variant: 'flat' }), 'tw:hidden tw:sm:inline-flex')}
          >
            مشاهده همه
            <ArrowLeft data-icon="inline-end" aria-hidden="true" />
          </Link>
        </RevealItem>

        <RevealItem>
          <Suspense
            fallback={
              <PetTypesCarouselSection petTypes={categoriesSectionSkeletonData} isLoading />
            }
          >
            <CategoriesSectionErrorBoundary>
              <CategoriesSectionContainer petTypesPromise={petTypesPromise} />
            </CategoriesSectionErrorBoundary>
          </Suspense>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
