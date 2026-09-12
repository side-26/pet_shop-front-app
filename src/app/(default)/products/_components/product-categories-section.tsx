import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getAllLandingPetTypes } from '@/entities/landing/landing.service';
import { cn } from '@/lib/utils';

import { ProductCategoriesSectionContainer } from './product-categories-section-container';
import { ProductCategoriesSectionErrorBoundary } from './product-categories-section-error-boundary';
import { ProductCategoriesSectionRenderer } from './product-categories-section-renderer';
import { productCategoriesSectionSkeletonData } from './product-categories-section-skeleton-data';

export function ProductCategoriesSection() {
  const petTypesPromise = getAllLandingPetTypes();

  return (
    <section
      id="pet-categories"
      aria-labelledby="pet-categories-title"
      className="tw:bg-surface tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8">
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
          <h2
            id="pet-categories-title"
            className="tw:text-title-m tw:font-semibold tw:sm:text-heading-2 tw:sm:font-bold tw:lg:text-heading-1"
          >
            از دنیای او شروع کن
          </h2>
          <Link
            href={routePaths.productsList}
            prefetch
            className={cn(
              'tw:sm:h-10 tw:sm:gap-2 tw:sm:px-4 tw:sm:text-label-m',
              buttonVariants({ variant: 'text', color: 'primary', size: 'xs' }),
            )}
          >
            مشاهده محصولات بیشتر
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-end" />
          </Link>
        </div>

        <Suspense
          fallback={
            <ProductCategoriesSectionRenderer
              petTypes={productCategoriesSectionSkeletonData}
              isSkeleton
            />
          }
        >
          <ProductCategoriesSectionErrorBoundary>
            <ProductCategoriesSectionContainer petTypesPromise={petTypesPromise} />
          </ProductCategoriesSectionErrorBoundary>
        </Suspense>
      </div>
    </section>
  );
}
