import { describe, expect, it } from 'vitest';

import { provinceIdSchema } from './locations.schema';

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
