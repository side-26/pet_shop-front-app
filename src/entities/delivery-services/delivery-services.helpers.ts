import type { DeliveryServiceQueryDTO } from './delivery-services.dto';

export function createDeliveryServicesListCacheKey(query: DeliveryServiceQueryDTO): string {
  return `includeDisabled=${query.includeDisabled}`;
}
