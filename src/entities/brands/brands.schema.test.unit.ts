import { describe, expect, it } from 'vitest';

import { brandIdSchema, brandQuerySchema, brandSchema } from './brands.schema';

const logo = new File(['logo'], 'brand.webp', { type: 'image/webp' });

describe('brand schemas', () => {
  it('normalizes creation input and supplies backend defaults', async () => {
    await expect(
      brandSchema.validate({ title: '  Royal Canin  ', title_fa: '  رویال کنین  ', logo }),
    ).resolves.toMatchObject({
      title: 'Royal Canin',
      title_fa: 'رویال کنین',
      logo,
      description: '',
      isEnable: true,
    });
  });

  it('rejects invalid brand fields, logos, and identifiers', async () => {
    await expect(brandSchema.validate({ title: 'A', title_fa: 'ف' })).rejects.toBeDefined();
    await expect(
      brandSchema.validate({
        title: 'Royal Canin',
        title_fa: 'رویال کنین',
        logo: new File(['logo'], 'brand.gif', { type: 'image/gif' }),
      }),
    ).rejects.toBeDefined();
    await expect(brandIdSchema.validate({ id: 'invalid' })).rejects.toBeDefined();
  });

  it('defaults the management list filter to enabled brands', async () => {
    await expect(brandQuerySchema.validate({})).resolves.toEqual({ includeDisabled: false });
    await expect(brandQuerySchema.validate({ includeDisabled: 'true' })).resolves.toEqual({
      includeDisabled: true,
    });
  });
});
