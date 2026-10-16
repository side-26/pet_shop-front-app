import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getHomeLandingPetTypesAction } from '@/entities/landing/landing.actions';
import { cn } from '@/lib/utils';

import { CategoriesSectionContent } from './categories-section-content';
import { CategoriesSectionErrorBoundary } from './categories-section-error-boundary';
import { CategoriesSectionRenderer } from './categories-section-renderer';
import { categoriesSectionSkeletonData } from './categories-section-skeleton-data';

export function CategoriesSection() {
  const petTypesPromise = getHomeLandingPetTypesAction();

  return (
    <section
      aria-labelledby="categories-title"
      className="tw:overflow-hidden tw:bg-surface tw:py-16 tw:lg:py-24"
    >
      <div className="tw:default-layout-container tw:flex tw:flex-col tw:gap-8">
        <div className="tw:flex tw:items-end tw:justify-between tw:gap-4">
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
        </div>

        <Suspense
          fallback={
            <CategoriesSectionRenderer petTypes={categoriesSectionSkeletonData} isSkeleton />
          }
        >
          <CategoriesSectionErrorBoundary>
            <CategoriesSectionContent petTypesPromise={petTypesPromise} />
          </CategoriesSectionErrorBoundary>
        </Suspense>
      </div>
    </section>
  );
}
