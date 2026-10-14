import { internalFetcher } from '@/lib/api/internalFetcher';

import type {
  LandingProductListPageDTO,
  LandingProductListQueryDTO,
  LandingSearchPageDTO,
  LandingSearchQueryDTO,
} from './landing.dto';

export const landingClientService = {
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
