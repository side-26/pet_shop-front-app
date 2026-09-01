import { describe, expect, it } from 'vitest';

import {
  subCategoryIdSchema,
  subCategoryQuerySchema,
  subCategorySchema,
  updateSubCategorySchema,
} from './sub-categories.schema';

const category = '507f1f77bcf86cd799439011';

describe('sub-category schemas', () => {
  it('trims and validates create and update input', async () => {
    await expect(subCategorySchema.validate({ title: '  غذای خشک  ', category })).resolves.toEqual({
      title: 'غذای خشک',
      category,
    });
    await expect(
      updateSubCategorySchema.validate({ title: '  غذای ویژه  ', category }),
    ).resolves.toEqual({ title: 'غذای ویژه', category });
  });

  it('enforces title boundaries', async () => {
    await expect(subCategorySchema.validate({ title: 'غ', category })).rejects.toBeDefined();
    await expect(
      subCategorySchema.validate({ title: 'غ'.repeat(51), category }),
    ).rejects.toBeDefined();
  });

  it('requires a valid category identifier', async () => {
    await expect(
      subCategorySchema.validate({ title: 'غذای خشک', category: 'invalid' }),
    ).rejects.toBeDefined();
    await expect(subCategorySchema.validate({ title: 'غذای خشک' })).rejects.toBeDefined();
  });

  it('accepts an optional category list filter', async () => {
    await expect(subCategoryQuerySchema.validate({})).resolves.toEqual({});
    await expect(subCategoryQuerySchema.validate({ category: `  ${category}  ` })).resolves.toEqual(
      {
        category,
      },
    );
  });

  it('rejects malformed list filters and ids', async () => {
    await expect(subCategoryQuerySchema.validate({ category: 'invalid' })).rejects.toBeDefined();
    await expect(subCategoryIdSchema.validate({ id: 'invalid' })).rejects.toBeDefined();
  });
});
