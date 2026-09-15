import { describe, expect, it } from 'vitest';

import {
  landingDiscountLimitSchema,
  landingPetListRequestSchema,
  landingProductListRequestSchema,
  landingSlugSchema,
  landingSearchQuerySchema,
} from './landing.schema';

describe('landing schemas', () => {
  it('normalizes the optional discounted-products limit to the backend default', async () => {
    await expect(landingDiscountLimitSchema.validate({})).resolves.toEqual({ limit: 4 });
    await expect(landingDiscountLimitSchema.validate({ limit: '12' })).resolves.toEqual({
      limit: 12,
    });
  });

  it('rejects limits and slugs outside the backend contract', async () => {
    await expect(landingDiscountLimitSchema.validate({ limit: 101 })).rejects.toBeDefined();
    await expect(landingSlugSchema.validate({ slug: 'invalid_slug' })).rejects.toBeDefined();
    await expect(landingSlugSchema.validate({ slug: '  persian-cat  ' })).resolves.toEqual({
      slug: 'persian-cat',
    });
  });

  it('normalizes repeated catalogue IDs, accepts isEnable, and removes the legacy available facet', async () => {
    await expect(
      landingProductListRequestSchema.validate(
        {
          available: 'true',
          category: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
          isEnable: 'false',
        },
        { stripUnknown: true },
      ),
    ).resolves.toEqual({
      category: '507f1f77bcf86cd799439011,507f1f77bcf86cd799439012',
      isEnable: false,
      page: 1,
      sort: 'most-sales',
    });
  });

  it('normalizes the backend landing pet-list query', async () => {
    await expect(
      landingPetListRequestSchema.validate(
        {
          petType: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
          breed: '507f1f77bcf86cd799439013',
          isEnable: 'false',
          priceFrom: '100',
          priceTo: '300',
          sort: 'less-sales',
        },
        { stripUnknown: true },
      ),
    ).resolves.toEqual({
      breed: '507f1f77bcf86cd799439013',
      isEnable: false,
      page: 1,
      petType: '507f1f77bcf86cd799439011,507f1f77bcf86cd799439012',
      priceFrom: 100,
      priceTo: 300,
      sort: 'less-sales',
    });
  });
});

it('normalizes the bounded catalog-search query', async () => {
  await expect(landingSearchQuerySchema.validate({ search: '  غذای گربه  ' })).resolves.toEqual({
    search: 'غذای گربه',
  });
  await expect(landingSearchQuerySchema.validate({ search: '' })).rejects.toBeDefined();
  await expect(
    landingSearchQuerySchema.validate({ search: 'a'.repeat(101) }),
  ).rejects.toBeDefined();
});
