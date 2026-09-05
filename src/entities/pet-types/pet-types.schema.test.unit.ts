import { describe, expect, it } from 'vitest';

import { petTypeSchema, updatePetTypeSchema } from './pet-types.schema';

const validImage = new File(['image'], 'dog.jpg', { type: 'image/jpeg' });
const description = { type: 'doc' as const, content: [] };

describe('petTypeSchema', () => {
  it('accepts a JPEG image up to 1 MB', async () => {
    await expect(
      petTypeSchema.validate({ title: 'سگ', description, mainImage: validImage }),
    ).resolves.toMatchObject({ title: 'سگ', mainImage: validImage });
  });

  it('rejects unsupported formats and images larger than 1 MB', async () => {
    await expect(
      petTypeSchema.validate({ title: 'سگ', description: '<p>HTML</p>', mainImage: validImage }),
    ).rejects.toThrow('JSON ساخت‌یافته');
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

  it('does not validate an optional image on update', async () => {
    const unsupportedImage = new File(['image'], 'dog.gif', { type: 'image/gif' });

    await expect(
      updatePetTypeSchema.validate({
        title: 'سگ',
        description,
        mainImage: unsupportedImage,
      }),
    ).resolves.toEqual({ title: 'سگ', description, mainImage: unsupportedImage });
  });

  it('treats an existing API image URL as an unchanged image on update', async () => {
    await expect(
      updatePetTypeSchema.validate({
        title: 'سگ',
        description,
        mainImage: 'https://cdn.example.test/pet-types/dog.webp',
      }),
    ).resolves.toEqual({ title: 'سگ', description });
  });
});
