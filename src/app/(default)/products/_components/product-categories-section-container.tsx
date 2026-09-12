import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { ProductCategoriesSectionFetchError } from './product-categories-section-fetch-error';
import { ProductCategoriesSectionRenderer } from './product-categories-section-renderer';

type ProductCategoriesSectionContainerProps = Readonly<{
  petTypesPromise: Promise<FetcherResult<LandingPetTypeDTO[]>>;
}>;

export async function ProductCategoriesSectionContainer({
  petTypesPromise,
}: ProductCategoriesSectionContainerProps) {
  const result = await petTypesPromise;

  if (!result.isSuccess) {
    return <ProductCategoriesSectionFetchError description={result.message} />;
  }

  if (result.data.length === 0) {
    return null;
  }

  return <ProductCategoriesSectionRenderer petTypes={result.data} />;
}
