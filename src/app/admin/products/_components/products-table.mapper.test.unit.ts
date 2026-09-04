import { describe, expect, it } from 'vitest';

import { mapProductsPageViewModel } from './products-table.mapper';

describe('mapProductsPageViewModel', () => {
  it('maps relation objects and missing subcategories into table-safe rows', () => {
    const result = mapProductsPageViewModel({
      result: [
        {
          id: 'product-1',
          title: 'غذای خشک',
          mainImage: '',
          images: [],
          mainImageThumbnail: '',
          description: '',
          category: { id: 'category-1', title: 'غذا' },
          subCategory: null,
          quantity: 3,
          price: 0,
          discountPercentage: 0,
          isEnable: true,
          slug: 'food',
          createdAt: '',
          updatedAt: '',
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      },
    });

    expect(result).toEqual({
      products: [
        {
          id: 'product-1',
          title: 'غذای خشک',
          category: 'غذا',
          subCategory: '_',
          quantity: 3,
          isEnable: true,
        },
      ],
      page: 1,
      pageCount: 1,
      total: 1,
    });
  });
});
