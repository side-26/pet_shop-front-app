import { describe, expect, it } from 'vitest';

import {
  categoryIdSchema,
  categoryQuerySchema,
  categorySchema,
  updateCategorySchema,
} from './categories.schema';

const petType = '507f1f77bcf86cd799439011';
const mainImage = new File(['image'], 'category.webp', { type: 'image/webp' });

describe('category schemas', () => {
  it('trims create input and applies isEnable=true', async () => {
    await expect(
      categorySchema.validate({ title: '  غذای خشک  ', petType, mainImage }),
    ).resolves.toEqual({
      title: 'غذای خشک',
      petType,
      mainImage,
      isEnable: true,
    });
  });

  it('enforces title and pet-type boundaries', async () => {
    await expect(categorySchema.validate({ title: 'غ', petType, mainImage })).rejects.toBeDefined();
    await expect(
      categorySchema.validate({ title: 'غذای خشک', petType: 'invalid', mainImage }),
    ).rejects.toBeDefined();
    await expect(categorySchema.validate({ title: 'غذای خشک', mainImage })).rejects.toBeDefined();
  });

  it('requires title, petType, and mainImage on update while preserving isEnable', async () => {
    await expect(
      updateCategorySchema.validate({ title: 'اسباب‌بازی', petType, mainImage, isEnable: false }),
    ).resolves.toEqual({ title: 'اسباب‌بازی', petType, mainImage, isEnable: false });
    await expect(
      updateCategorySchema.validate({ title: 'اسباب‌بازی', petType }),
    ).rejects.toBeDefined();
  });

  it('rejects unsupported or oversized category images', async () => {
    const invalidType = new File(['image'], 'category.gif', { type: 'image/gif' });
    const oversized = new File([new Uint8Array(1024 * 1024 + 1)], 'category.webp', {
      type: 'image/webp',
    });

    await expect(
      categorySchema.validate({ title: 'غذای خشک', petType, mainImage: invalidType }),
    ).rejects.toBeDefined();
    await expect(
      categorySchema.validate({ title: 'غذای خشک', petType, mainImage: oversized }),
    ).rejects.toBeDefined();
  });

  it('applies list defaults and accepts the backend filters', async () => {
    await expect(categoryQuerySchema.validate({})).resolves.toEqual({ includeDisabled: false });
    await expect(
      categoryQuerySchema.validate({ includeDisabled: 'true', petType }),
    ).resolves.toEqual({ includeDisabled: true, petType });
  });

  it('rejects malformed category ids', async () => {
    await expect(categoryIdSchema.validate({ id: 'invalid' })).rejects.toBeDefined();
  });
});
