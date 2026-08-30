import { describe, expect, it } from 'vitest';

import { petTypeSchema } from './pet-types.schema';

const validImage = new File(['image'], 'dog.jpg', { type: 'image/jpeg' });

describe('petTypeSchema', () => {
  it('accepts a JPEG image up to 1 MB', async () => {
    await expect(
      petTypeSchema.validate({ title: 'سگ', description: '', mainImage: validImage }),
    ).resolves.toMatchObject({ title: 'سگ', mainImage: validImage });
  });

  it('rejects unsupported formats and images larger than 1 MB', async () => {
    await expect(
      petTypeSchema.validate({
        title: 'سگ',
        mainImage: new File(['image'], 'dog.gif', { type: 'image/gif' }),
      }),
    ).rejects.toThrow('فرمت تصویر');

    await expect(
      petTypeSchema.validate({
        title: 'سگ',
        mainImage: new File([new Uint8Array(1024 * 1024 + 1)], 'dog.webp', {
          type: 'image/webp',
        }),
      }),
    ).rejects.toThrow('۱ مگابایت');
  });
});
