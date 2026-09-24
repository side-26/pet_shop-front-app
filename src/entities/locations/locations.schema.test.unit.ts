import { describe, expect, it } from 'vitest';

import { provinceIdSchema, reverseGeocodeSchema } from './locations.schema';

describe('provinceIdSchema', () => {
  it('coerces a positive integer province identifier', async () => {
    await expect(provinceIdSchema.validate({ provinceId: '8' })).resolves.toEqual({
      provinceId: 8,
    });
  });

  it.each([{ provinceId: 0 }, { provinceId: 1.5 }, { provinceId: 'invalid' }])(
    'rejects invalid province input: %o',
    async (input) => {
      await expect(provinceIdSchema.validate(input)).rejects.toThrow('شناسه استان');
    },
  );
});

describe('reverseGeocodeSchema', () => {
  it('coerces valid coordinate query values', async () => {
    await expect(
      reverseGeocodeSchema.validate({ lat: '35.7219', lng: '51.3347' }),
    ).resolves.toEqual({
      lat: 35.7219,
      lng: 51.3347,
    });
  });

  it.each([
    { lat: -90.1, lng: 51 },
    { lat: 90.1, lng: 51 },
    { lat: 35, lng: -180.1 },
    { lat: 35, lng: 180.1 },
    { lat: 'invalid', lng: 51 },
    { lat: 35, lng: 'invalid' },
  ])('rejects invalid coordinates: %o', async (input) => {
    await expect(reverseGeocodeSchema.validate(input)).rejects.toThrow();
  });
});
