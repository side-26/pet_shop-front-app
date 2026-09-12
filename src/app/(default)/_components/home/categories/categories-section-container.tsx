import { PetTypesCarouselSection } from '@/components/common/pet-types-carousel-section';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { CategoriesSectionFetchError } from './categories-section-fetch-error';

type Props = Readonly<{
  petTypesPromise: Promise<FetcherResult<LandingPetTypeDTO[]>>;
}>;

export async function CategoriesSectionContainer({ petTypesPromise }: Props) {
  const result = await petTypesPromise;
  if (!result.isSuccess) {
    return <CategoriesSectionFetchError description={result.message} />;
  }

  if (result.data.length === 0) return null;

  return <PetTypesCarouselSection petTypes={result.data} />;
}
