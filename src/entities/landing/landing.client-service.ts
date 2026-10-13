import { internalFetcher } from '@/lib/api/internalFetcher';

import type { LandingSearchPageDTO, LandingSearchQueryDTO } from './landing.dto';

export const landingClientService = {
  getSearch(query: LandingSearchQueryDTO, signal?: AbortSignal): Promise<LandingSearchPageDTO> {
    return internalFetcher<LandingSearchPageDTO>({
      url: '/api/landing/search',
      method: 'GET',
      query,
      signal,
    });
  },
};
