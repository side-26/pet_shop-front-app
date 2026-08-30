import { describe, expect, it } from 'vitest';

import { rangePetTypePropertyDefinitionsSchema } from './pet-types.schema';

const id = '507f1f77bcf86cd799439011';

describe('rangePetTypePropertyDefinitionsSchema', () => {
  it('trims labels and string values while retaining finite numeric values', async () => {
    await expect(
      rangePetTypePropertyDefinitionsSchema.validate({
        id,
        propertyDefinitions: [
          { label: ' رنگ ', value: ' قهوه‌ای ' },
          { label: 'وزن', value: 12 },
        ],
      }),
    ).resolves.toEqual({
      id,
      propertyDefinitions: [
        { label: 'رنگ', value: 'قهوه‌ای' },
        { label: 'وزن', value: 12 },
      ],
    });
  });

  it('rejects blank labels, blank values, invalid values, and invalid IDs', async () => {
    await expect(
      rangePetTypePropertyDefinitionsSchema.validate({
        id: 'invalid',
        propertyDefinitions: [
          { label: ' ', value: ' ' },
          { label: 'نوع', value: false },
        ],
      }),
    ).rejects.toThrow();
  });
});
