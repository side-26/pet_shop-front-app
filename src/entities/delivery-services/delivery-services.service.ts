import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  AvailableDeliveryServiceDTO,
  AvailableDeliveryServicesQueryDTO,
  CreateDeliveryServiceDTO,
  DeleteDeliveryServiceResultDTO,
  DeliveryServiceDTO,
  DeliveryServiceIdDTO,
  DeliveryServiceQueryDTO,
  UpdateDeliveryServiceDTO,
} from './delivery-services.dto';
import { createDeliveryServicesListCacheKey } from './delivery-services.helpers';
import { deliveryServiceQuerySchema } from './delivery-services.schema';

const deliveryServicesCache = new EntityTag('delivery-services');

export async function getAllDeliveryServices(input: Partial<DeliveryServiceQueryDTO> = {}) {
  const query = await deliveryServiceQuerySchema.validate(input, { stripUnknown: true });
  return fetchAllDeliveryServices(query);
}

async function fetchAllDeliveryServices(query: DeliveryServiceQueryDTO) {
  'use cache: private';

  deliveryServicesCache.cacheLife({ stale: 600 });
  deliveryServicesCache.registerList(createDeliveryServicesListCacheKey(query));
  return customFetcher<DeliveryServiceDTO[]>({
    url: '/delivery-services',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getDeliveryServiceById(id: DeliveryServiceIdDTO['id']) {
  'use cache: private';

  deliveryServicesCache.cacheLife({ stale: 600 });
  deliveryServicesCache.registerDetail(id);
  return customFetcher<DeliveryServiceDTO>({
    url: `/delivery-services/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function getAvailableDeliveryServices(query: AvailableDeliveryServicesQueryDTO) {
  return customFetcher<AvailableDeliveryServiceDTO[]>({
    url: '/delivery-services/available',
    method: 'GET',
    query,
    auth: false,
    cache: 'no-store',
  });
}

function invalidate(id?: string) {
  deliveryServicesCache.invalidateList();
  if (id) deliveryServicesCache.invalidateDetail(id);
}

export async function createDeliveryService(input: CreateDeliveryServiceDTO) {
  const result = await customFetcher<DeliveryServiceDTO, unknown, CreateDeliveryServiceDTO>({
    url: '/delivery-services',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}

export async function updateDeliveryService(id: string, input: UpdateDeliveryServiceDTO) {
  const result = await customFetcher<DeliveryServiceDTO, unknown, UpdateDeliveryServiceDTO>({
    url: `/delivery-services/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

async function updateDeliveryServiceStatus(id: string, status: 'enable' | 'disable') {
  const result = await customFetcher<DeliveryServiceDTO, unknown, undefined>({
    url: `/delivery-services/${id}/${status}`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

export const enableDeliveryService = (id: string) => updateDeliveryServiceStatus(id, 'enable');
export const disableDeliveryService = (id: string) => updateDeliveryServiceStatus(id, 'disable');

export async function deleteDeliveryService(id: string) {
  const result = await customFetcher<DeleteDeliveryServiceResultDTO>({
    url: `/delivery-services/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
