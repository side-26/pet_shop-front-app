import { describe, expect, it } from 'vitest';

import {
  breedPropertyDefinitionsFormSchema,
  breedQuerySchema,
  updateBreedSchema,
} from './breeds.schema';

describe('breedQuerySchema', () => {
  it('applies the backend pagination and visibility defaults', async () => {
    await expect(breedQuerySchema.validate({})).resolves.toMatchObject({
      includeDisabled: true,
      limit: 10,
      page: 1,
      sort: 'title',
    });
  });

  it('rejects malformed pet type identifiers', async () => {
    await expect(breedQuerySchema.validate({ petType: 'invalid' })).rejects.toBeDefined();
  });

  it('accepts the supported paginate filters and breed level boundaries', async () => {
    await expect(
      breedQuerySchema.validate({
        title: 'پرشین',
        petType: '507f1f77bcf86cd799439011',
        country: 'ایران',
        size: 0,
        activityLevel: 4,
      }),
    ).resolves.toMatchObject({ size: 0, activityLevel: 4 });

    await expect(breedQuerySchema.validate({ size: 5 })).rejects.toBeDefined();
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

  it('allows an existing breed to be updated without replacing its image', async () => {
    await expect(
      updateBreedSchema.validate({
        title: 'گلدن رتریور',
        petType: '507f1f77bcf86cd799439011',
        country: 'اسکاتلند',
        ageAverage: '۱۰ تا ۱۲ سال',
        size: 4,
        activityLevel: 4,
        enable: true,
      }),
    ).resolves.toMatchObject({ title: 'گلدن رتریور' });
  });
});
