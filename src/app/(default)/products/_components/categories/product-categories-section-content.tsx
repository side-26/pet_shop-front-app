import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { ProductCategoriesSectionEmptyFetch } from './product-categories-section-empty-fetch';
import { ProductCategoriesSectionRenderer } from './product-categories-section-renderer';

type ProductCategoriesSectionContentProps = Readonly<{
  petTypesPromise: Promise<LandingPetTypeDTO[]>;
}>;

export function ProductCategoriesSectionContent({
  petTypesPromise,
}: ProductCategoriesSectionContentProps) {
  const petTypes = use(petTypesPromise);

  return (
    <EmptyStateBoundary data={petTypes} fallback={<ProductCategoriesSectionEmptyFetch />}>
      <ProductCategoriesSectionRenderer petTypes={petTypes} />
    </EmptyStateBoundary>
  );
}
