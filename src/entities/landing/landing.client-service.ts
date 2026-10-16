import { internalFetcher } from '@/lib/api/internalFetcher';

import type {
  LandingPetTypeDTO,
  LandingPetListPageDTO,
  LandingPetListQueryDTO,
  LandingProductListPageDTO,
  LandingProductListQueryDTO,
  LandingSearchPageDTO,
  LandingSearchQueryDTO,
} from './landing.dto';

export const landingClientService = {
  getPetTypes(signal?: AbortSignal): Promise<LandingPetTypeDTO[]> {
    return internalFetcher<LandingPetTypeDTO[]>({
      url: '/api/landing/pet-types',
      method: 'GET',
      signal,
    });
  },
  getPets(
    query: Partial<LandingPetListQueryDTO>,
    signal?: AbortSignal,
  ): Promise<LandingPetListPageDTO> {
    return internalFetcher<LandingPetListPageDTO>({
      url: '/api/landing/pets',
      method: 'GET',
      query,
      signal,
    });
  },
  getProducts(
    query: Partial<LandingProductListQueryDTO>,
    signal?: AbortSignal,
  ): Promise<LandingProductListPageDTO> {
    return internalFetcher<LandingProductListPageDTO>({
      url: '/api/landing/products',
      method: 'GET',
      query,
      signal,
    });
  },
  getSearch(query: LandingSearchQueryDTO, signal?: AbortSignal): Promise<LandingSearchPageDTO> {
    return internalFetcher<LandingSearchPageDTO>({
      url: '/api/landing/search',
      method: 'GET',
      query,
      signal,
    });
  },
};
