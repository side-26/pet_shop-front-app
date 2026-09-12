import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { FeaturedProductsSectionFetchError } from './featured-products-section-fetch-error';
import { FeaturedProductsRenderer } from './featured-products-section-renderer';

type FeaturedProductsSectionContainerProps = Readonly<{
  popularProductsPromise: Promise<FetcherResult<LandingPopularProductDTO[]>>;
}>;

export async function FeaturedProductsSectionContainer({
  popularProductsPromise,
}: FeaturedProductsSectionContainerProps) {
  const result = await popularProductsPromise;
  if (!result.isSuccess) return <FeaturedProductsSectionFetchError description={result.message} />;
  if (result.data.length === 0) return null;
  return <FeaturedProductsRenderer products={result.data} />;
}
