import { describe, expect, it } from 'vitest';

import {
  categoryIdSchema,
  categoryQuerySchema,
  categorySchema,
  updateCategorySchema,
} from './categories.schema';

const petType = '507f1f77bcf86cd799439011';

describe('category schemas', () => {
  it('trims create input and applies enable=true', async () => {
    await expect(categorySchema.validate({ title: '  غذای خشک  ', petType })).resolves.toEqual({
      title: 'غذای خشک',
      petType,
      enable: true,
    });
  });

  it('enforces title and pet-type boundaries', async () => {
    await expect(categorySchema.validate({ title: 'غ', petType })).rejects.toBeDefined();
    await expect(
      categorySchema.validate({ title: 'غذای خشک', petType: 'invalid' }),
    ).rejects.toBeDefined();
    await expect(categorySchema.validate({ title: 'غذای خشک' })).rejects.toBeDefined();
  });

  it('requires title and petType on update while preserving an optional enable value', async () => {
    await expect(
      updateCategorySchema.validate({ title: 'اسباب‌بازی', petType, enable: false }),
    ).resolves.toEqual({ title: 'اسباب‌بازی', petType, enable: false });
    await expect(updateCategorySchema.validate({ title: 'اسباب‌بازی' })).rejects.toBeDefined();
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
