import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { LandingPopularBrandDTO } from '@/entities/landing/landing.dto';

import { PopularBrandsSectionEmptyFetch } from './popular-brands-section-empty-fetch';
import { PopularBrandsSectionRenderer } from './popular-brands-section-renderer';

type PopularBrandsSectionContentProps = Readonly<{
  popularBrandsPromise: Promise<LandingPopularBrandDTO[]>;
}>;

export function PopularBrandsSectionContent({
  popularBrandsPromise,
}: PopularBrandsSectionContentProps) {
  const brands = use(popularBrandsPromise);

  return (
    <EmptyStateBoundary data={brands} fallback={<PopularBrandsSectionEmptyFetch />}>
      <PopularBrandsSectionRenderer brands={brands} />
    </EmptyStateBoundary>
  );
}
