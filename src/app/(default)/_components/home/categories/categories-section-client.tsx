'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { PetTypesCarouselSection } from '@/components/common/pet-types-carousel-section';
import { buttonVariants } from '@/components/ui/button';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { routePaths } from '@/configs/route.path';
import { useSuspenseLandingPetTypesQuery } from '@/entities/landing/landing.client';
import { cn } from '@/lib/utils';

import { CategoriesSectionErrorFallback } from './categories-section-error-fallback';
import { categoriesSectionSkeletonData } from './categories-section-skeleton-data';

function CategoriesSectionContent() {
  const { data: petTypes } = useSuspenseLandingPetTypesQuery();

  return <PetTypesCarouselSection petTypes={petTypes} />;
}

export function CategoriesSectionClient() {
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

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorStateBoundary
              fallbackRender={({ error, retry }) => (
                <CategoriesSectionErrorFallback
                  error={error}
                  onRetry={() => {
                    reset();
                    retry();
                  }}
                />
              )}
            >
              <Suspense
                fallback={
                  <PetTypesCarouselSection petTypes={categoriesSectionSkeletonData} isLoading />
                }
              >
                <CategoriesSectionContent />
              </Suspense>
            </ErrorStateBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </section>
  );
}
