import { describe, expect, it } from 'vitest';

import { deleteImageSchema, uploadImageSchema } from './images.schema';

describe('image schemas', () => {
  it('accepts a supported image and rejects missing or invalid upload files', async () => {
    const image = new File(['image'], 'main.webp', { type: 'image/webp' });

    await expect(uploadImageSchema.validate({ mainImage: image })).resolves.toEqual({
      mainImage: image,
    });
    await expect(uploadImageSchema.validate({})).rejects.toThrow();
    await expect(
      uploadImageSchema.validate({
        mainImage: new File(['text'], 'main.txt', { type: 'text/plain' }),
      }),
    ).rejects.toThrow();
  });

  it('accepts a valid storage URL for deletion', async () => {
    await expect(
      deleteImageSchema.validate({
        imageUrl: 'https://cdn.example.test/management/images/main.webp',
      }),
    ).resolves.toEqual({ imageUrl: 'https://cdn.example.test/management/images/main.webp' });
  });
});
