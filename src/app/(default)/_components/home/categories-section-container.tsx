import { PetTypesCarouselSection } from '@/components/common/pet-types-carousel-section';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

type Props = Readonly<{
  petTypesPromise: Promise<FetcherResult<LandingPetTypeDTO[]>>;
}>;

export async function CategoriesSectionContainer({ petTypesPromise }: Props) {
  const result = await petTypesPromise;
  if (!result.isSuccess || result.data.length === 0) return null;

  return <PetTypesCarouselSection petTypes={result.data} />;
}
