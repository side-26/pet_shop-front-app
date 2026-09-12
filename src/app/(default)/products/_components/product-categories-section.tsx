import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getAllLandingPetTypes } from '@/entities/landing/landing.service';

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
          <h2 id="pet-categories-title" className="tw:text-heading-2 tw:lg:text-heading-1">
            از دنیای او شروع کن
          </h2>
          <Link
            href={routePaths.productsList}
            prefetch
            className={buttonVariants({ variant: 'text', color: 'primary' })}
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
