import { describe, expect, it } from 'vitest';

import { breedPropertyDefinitionsFormSchema, breedQuerySchema } from './breeds.schema';

describe('breedQuerySchema', () => {
  it('applies the backend pagination and visibility defaults', async () => {
    await expect(breedQuerySchema.validate({})).resolves.toMatchObject({
      includeDisabled: true,
      limit: 20,
      page: 1,
      sort: 'title',
    });
  });

  it('rejects malformed pet type identifiers', async () => {
    await expect(breedQuerySchema.validate({ petType: 'invalid' })).rejects.toBeDefined();
  });

  it('accepts property-definition values used by the replacement endpoint', async () => {
    await expect(
      breedPropertyDefinitionsFormSchema.validate({
        propertyDefinitions: [{ label: 'رنگ', value: 'قهوه‌ای' }],
      }),
    ).resolves.toEqual({
      propertyDefinitions: [{ label: 'رنگ', value: 'قهوه‌ای' }],
    });
  });

  it('rejects an empty property-definition label or value', async () => {
    await expect(
      breedPropertyDefinitionsFormSchema.validate({
        propertyDefinitions: [{ label: '', value: '' }],
      }),
    ).rejects.toBeDefined();
  });
});
