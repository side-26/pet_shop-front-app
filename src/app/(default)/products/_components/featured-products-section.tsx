import { ArrowLeftIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getPopularLandingProducts } from '@/entities/landing/landing.service';
import { cn } from '@/lib/utils';

import { FeaturedProductsSectionContainer } from './featured-products-section-container';
import { FeaturedProductsSectionErrorBoundary } from './featured-products-section-error-boundary';
import { FeaturedProductsRenderer } from './featured-products-section-renderer';
import { featuredProductsSectionSkeletonData } from './featured-products-section-skeleton-data';
import { MotionItem, MotionSection } from './product-landing-motion';

export { FeaturedProductsRenderer } from './featured-products-section-renderer';

export function FeaturedProductsSection() {
  const popularProductsPromise = getPopularLandingProducts();

  return (
    <MotionSection
      id="featured-products"
      labelledBy="featured-products-title"
      cacheSection="featured-products"
      className="tw:relative tw:overflow-hidden tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <div className="tw:absolute tw:end-0 tw:top-0 tw:-z-10 tw:size-80 tw:translate-x-1/3 tw:-translate-y-1/3 tw:rounded-full tw:bg-secondary/15 tw:blur-3xl" />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8">
        <MotionItem className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:sm:items-end">
          <div className="tw:flex tw:items-center tw:gap-3">
            <span className="tw:hidden tw:size-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-secondary-muted tw:text-secondary-muted-foreground tw:sm:flex">
              <Sparkles aria-hidden="true" className="tw:size-6" />
            </span>
            <div className="tw:flex tw:flex-col tw:gap-1">
              <span className="tw:hidden tw:text-label-m tw:font-bold tw:text-secondary-active tw:sm:inline">
                محبوب‌ترین انتخاب‌ها
              </span>
              <h2
                id="featured-products-title"
                className="tw:text-title-l tw:font-semibold tw:sm:text-heading-2 tw:sm:font-bold tw:lg:text-heading-1"
              >
                انتخاب‌های محبوب
              </h2>
            </div>
          </div>
          <Link
            href={routePaths.productsList}
            prefetch
            aria-label="مشاهده همه محصولات"
            className={cn(
              'tw:lg:h-11 tw:lg:px-5 tw:lg:text-label-l',
              buttonVariants({ variant: 'outlined', color: 'primary', size: 'sm' }),
            )}
          >
            <span className="tw:lg:hidden">بیشتر</span>
            <span className="tw:hidden tw:lg:inline">مشاهده همه محصولات</span>
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-end" />
          </Link>
        </MotionItem>
        <Suspense
          fallback={
            <FeaturedProductsRenderer products={featuredProductsSectionSkeletonData} isSkeleton />
          }
        >
          <FeaturedProductsSectionErrorBoundary>
            <FeaturedProductsSectionContainer popularProductsPromise={popularProductsPromise} />
          </FeaturedProductsSectionErrorBoundary>
        </Suspense>
      </div>
    </MotionSection>
  );
}
