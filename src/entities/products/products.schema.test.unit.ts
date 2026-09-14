import { describe, expect, it } from 'vitest';

import {
  customerProductQuerySchema,
  managementProductQuerySchema,
  productSchema,
  updateProductBaseInfoSchema,
  updateProductUserRateSchema,
} from './products.schema';

const category = '507f1f77bcf86cd799439011';
const brand = '507f1f77bcf86cd799439012';
const description = { type: 'doc' as const, content: [] };
const images = {
  images: [new File(['image'], 'product.webp', { type: 'image/webp' })],
  mainImageIndex: 0,
};

describe('product schemas', () => {
  it('normalizes creation input and applies backend quantity defaults', async () => {
    await expect(
      productSchema.validate({ title: '  غذای خشک  ', description, category, brand, images }),
    ).resolves.toMatchObject({
      title: 'غذای خشک',
      description,
      category,
      brand,
      images,
      quantity: 0,
    });
  });
  it('rejects invalid image selection and empty updates', async () => {
    await expect(
      productSchema.validate({ title: 'غذا', description: '<p>HTML</p>', category, brand, images }),
    ).rejects.toThrow('JSON ساخت‌یافته');
    await expect(
      productSchema.validate({
        title: 'غذا',
        description,
        category,
        brand,
        images: { ...images, mainImageIndex: 1 },
      }),
    ).rejects.toBeDefined();
    await expect(updateProductBaseInfoSchema.validate({})).rejects.toBeDefined();
    await expect(updateProductBaseInfoSchema.validate({ title: 'جدید' })).rejects.toBeDefined();
    await expect(
      updateProductBaseInfoSchema.validate({ title: 'جدید', brand }),
    ).resolves.toMatchObject({ title: 'جدید', brand });
  });
  it('matches the customer and management query contracts', async () => {
    await expect(customerProductQuerySchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
    await expect(
      managementProductQuerySchema.validate({
        title: '  غذای ویژه  ',
        quantity: 12,
        price: 275000,
        isEnable: false,
        includeDisabled: 'true',
      }),
    ).resolves.toMatchObject({
      title: 'غذای ویژه',
      quantity: 12,
      price: 275000,
      isEnable: false,
      includeDisabled: true,
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
  });
  it('accepts the backend rating range in one-decimal increments', async () => {
    await expect(
      updateProductUserRateSchema.validate({ id: category, userRate: 4.3 }),
    ).resolves.toEqual({
      id: category,
      userRate: 4.3,
    });
    await expect(
      updateProductUserRateSchema.validate({ id: category, userRate: 4.25 }),
    ).rejects.toThrow('گام ۰٫۱');
    await expect(
      updateProductUserRateSchema.validate({ id: category, userRate: 5.1 }),
    ).rejects.toBeDefined();
  });
});
