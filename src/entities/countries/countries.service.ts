import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type { CountriesDTO } from './countries.dto';

const countriesCache = new EntityTag('countries');

export async function getCountries() {
  'use cache';

  countriesCache.registerList('all');

  return customFetcher<CountriesDTO>({
    url: '/countries',
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [countriesCache.list] },
  });
}
