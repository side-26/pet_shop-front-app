import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';

import { FeaturedProductsSectionEmptyFetch } from './featured-products-section-empty-fetch';
import { FeaturedProductsRenderer } from './featured-products-section-renderer';

type FeaturedProductsSectionContentProps = Readonly<{
  popularProductsPromise: Promise<LandingPopularProductDTO[]>;
}>;

export function FeaturedProductsSectionContent({
  popularProductsPromise,
}: FeaturedProductsSectionContentProps) {
  const products = use(popularProductsPromise);

  return (
    <EmptyStateBoundary data={products} fallback={<FeaturedProductsSectionEmptyFetch />}>
      <FeaturedProductsRenderer products={products} />
    </EmptyStateBoundary>
  );
}
