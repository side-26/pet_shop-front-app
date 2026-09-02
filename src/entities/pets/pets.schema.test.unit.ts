import { describe, expect, it } from 'vitest';

import {
  customerPetQuerySchema,
  customerPetPaginateQuerySchema,
  managementPetQuerySchema,
  petIdSchema,
  petSchema,
  updatePetBaseInfoSchema,
  updatePetImagesSchema,
  updatePetPriceSchema,
} from './pets.schema';

const petType = '507f1f77bcf86cd799439011';
const breed = '507f1f77bcf86cd799439012';
const mainImage = new File(['pet'], 'pet.webp', { type: 'image/webp' });
const images = { images: [mainImage], mainImageIndex: 0 };

describe('pet schemas', () => {
  it('normalizes create input and applies backend defaults', async () => {
    await expect(
      petSchema.validate({
        title: '  Persian kitten  ',
        description: ' Friendly kitten ',
        petType,
        breed,
        images,
      }),
    ).resolves.toMatchObject({
      title: 'Persian kitten',
      description: 'Friendly kitten',
      images,
      quantity: 0,
      price: 1000,
      discountPercentage: 0,
      inEnable: true,
      slug: 'persian-kitten',
    });
  });

  it('rejects invalid relations, slug, discount, and image', async () => {
    const base = { title: 'Kitten', description: 'Friendly', petType, breed, images };
    await expect(petSchema.validate({ ...base, slug: 'Bad Slug' })).rejects.toBeDefined();
    await expect(
      petSchema.validate({ ...base, slug: 'kitten', petType: 'invalid' }),
    ).rejects.toBeDefined();
    await expect(
      petSchema.validate({ ...base, slug: 'kitten', discountPercentage: 101 }),
    ).rejects.toBeDefined();
    await expect(
      petSchema.validate({ ...base, slug: 'kitten', images: { images: [], mainImageIndex: 0 } }),
    ).rejects.toBeDefined();
    await expect(
      petSchema.validate({
        ...base,
        slug: 'kitten',
        images: { images: Array.from({ length: 6 }, () => mainImage), mainImageIndex: 0 },
      }),
    ).rejects.toBeDefined();
  });

  it('accepts partial updates but rejects an empty update', async () => {
    await expect(updatePetBaseInfoSchema.validate({ quantity: 0 })).resolves.toEqual({
      quantity: 0,
    });
    await expect(updatePetImagesSchema.validate({ images })).resolves.toEqual({ images });
    await expect(updatePetPriceSchema.validate({ price: 125000 })).resolves.toEqual({
      price: 125000,
    });
    await expect(updatePetBaseInfoSchema.validate({})).rejects.toBeDefined();
    await expect(updatePetImagesSchema.validate({})).rejects.toBeDefined();
    await expect(
      updatePetImagesSchema.validate({ images: { images: [mainImage], mainImageIndex: 2 } }),
    ).rejects.toBeDefined();
    await expect(updatePetPriceSchema.validate({})).rejects.toBeDefined();
  });

  it('applies customer and management query defaults', async () => {
    await expect(customerPetQuerySchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
    await expect(managementPetQuerySchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
  });

  it('accepts ordered customer price ranges and rejects reversed ranges', async () => {
    await expect(
      customerPetPaginateQuerySchema.validate({ priceRange: '400-600' }),
    ).resolves.toMatchObject({
      priceRange: '400-600',
    });
    await expect(
      customerPetPaginateQuerySchema.validate({ priceRange: '600-400' }),
    ).rejects.toBeDefined();
  });

  it('rejects malformed ids and invalid pagination', async () => {
    await expect(petIdSchema.validate({ id: 'invalid' })).rejects.toBeDefined();
    await expect(customerPetQuerySchema.validate({ page: 0, limit: 101 })).rejects.toBeDefined();
  });
});
