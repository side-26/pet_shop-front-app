import type { LandingPopularBrandDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { PopularBrandsSectionFetchError } from './popular-brands-section-fetch-error';
import { PopularBrandsSectionRenderer } from './popular-brands-section-renderer';

type PopularBrandsSectionContainerProps = Readonly<{
  popularBrandsPromise: Promise<FetcherResult<LandingPopularBrandDTO[]>>;
}>;

export async function PopularBrandsSectionContainer({
  popularBrandsPromise,
}: PopularBrandsSectionContainerProps) {
  const result = await popularBrandsPromise;
  if (!result.isSuccess) return <PopularBrandsSectionFetchError description={result.message} />;
  if (result.data.length === 0) return null;
  return <PopularBrandsSectionRenderer brands={result.data} />;
}
