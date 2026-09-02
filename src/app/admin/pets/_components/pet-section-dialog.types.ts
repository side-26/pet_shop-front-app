import type { FetcherResult } from '@/lib/api/customFetcher';
import type { PetBaseInfoDTO, PetImagesDTO, PetPriceDTO } from '@/entities/pets/pets.dto';
import type { getPetFormOptionsAction } from '@/entities/pets/pets.actions';

export type PetSection = 'base-info' | 'price' | 'images';
export type PetSectionData = PetBaseInfoDTO | PetImagesDTO | PetPriceDTO;
export type PetSectionRequest = Promise<FetcherResult<PetSectionData>>;
export type PetFormOptionsRequest = ReturnType<typeof getPetFormOptionsAction>;
