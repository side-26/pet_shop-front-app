import { describe, expect, it } from 'vitest';

import { createDeliveryServicesListCacheKey } from './delivery-services.helpers';

describe('createDeliveryServicesListCacheKey', () => {
  it('creates a deterministic key from the normalized management filter', () => {
    expect(createDeliveryServicesListCacheKey({ includeDisabled: false })).toBe(
      'includeDisabled=false',
    );
    expect(createDeliveryServicesListCacheKey({ includeDisabled: true })).toBe(
      'includeDisabled=true',
    );
  });
});
