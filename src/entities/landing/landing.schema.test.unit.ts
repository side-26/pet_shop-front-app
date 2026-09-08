import { describe, expect, it } from 'vitest';

import { landingDiscountLimitSchema, landingSlugSchema } from './landing.schema';

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
});
