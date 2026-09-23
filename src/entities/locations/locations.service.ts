import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type { CitiesByProvinceIdDTO, CitiesDTO, ProvincesDTO } from './locations.dto';

const locationsCache = new EntityTag('locations');

export async function getProvinces() {
  'use cache';

  locationsCache.registerList('provinces');

  return customFetcher<ProvincesDTO>({ url: '/provinces', method: 'GET', auth: false });
}

export async function getCitiesByProvinceId({ provinceId }: CitiesByProvinceIdDTO) {
  'use cache';

  locationsCache.registerList(`cities:${provinceId}`);

  return customFetcher<CitiesDTO>({ url: `/cities/${provinceId}`, method: 'GET', auth: false });
}
