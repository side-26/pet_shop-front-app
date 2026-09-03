import { describe, expect, it } from 'vitest';

import {
  customerProductQuerySchema,
  managementProductQuerySchema,
  productSchema,
  updateProductBaseInfoSchema,
} from './products.schema';

const category = '507f1f77bcf86cd799439011';
const images = {
  images: [new File(['image'], 'product.webp', { type: 'image/webp' })],
  mainImageIndex: 0,
};

describe('product schemas', () => {
  it('normalizes creation input and applies backend quantity defaults', async () => {
    await expect(
      productSchema.validate({ title: '  غذای خشک  ', description: 'توضیحات', category, images }),
    ).resolves.toMatchObject({
      title: 'غذای خشک',
      description: 'توضیحات',
      category,
      images,
      quantity: 0,
    });
  });
  it('rejects invalid image selection and empty updates', async () => {
    await expect(
      productSchema.validate({
        title: 'غذا',
        description: 'توضیحات',
        category,
        images: { ...images, mainImageIndex: 1 },
      }),
    ).rejects.toBeDefined();
    await expect(updateProductBaseInfoSchema.validate({})).rejects.toBeDefined();
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
});
