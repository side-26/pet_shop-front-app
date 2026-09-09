import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsPaginateTable } from './products-paginate-table';

vi.mock('@/components/common/table-pagination', () => ({
  TablePagination: () => <div />,
}));
vi.mock('./product-enabled-switch', () => ({
  ProductEnabledSwitch: () => <span>وضعیت</span>,
}));
vi.mock('./product-row-actions', () => ({
  ProductRowActions: () => <span>عملیات</span>,
}));

afterEach(cleanup);

describe('ProductsPaginateTable', () => {
  it('renders the clamped brand column directly after the title column', () => {
    const brand = 'برند بسیار طولانی محصول برای بررسی محدودسازی متن در جدول';

    render(
      <ProductsPaginateTable
        products={[
          {
            id: 'product-1',
            mainImage: '',
            mainImageThumbnail: '',
            title: 'غذای خشک',
            brand,
            category: 'غذا',
            subCategory: 'خشک',
            quantity: 3,
            price: 250000,
            isEnable: true,
          },
        ]}
        page={1}
        pageCount={1}
        total={1}
        query={{}}
      />,
    );

    const headers = screen.getAllByRole('columnheader');
    const brandText = screen.getByText(brand);

    expect(headers.map((header) => header.textContent)).toEqual([
      'تصویر',
      'عنوان',
      'برند',
      'دسته‌بندی',
      'زیر دسته‌بندی',
      'موجودی',
      'قیمت',
      'وضعیت',
      'عملیات',
    ]);
    expect(brandText.className).toContain('tw:line-clamp-2');
    expect(brandText.closest('td')?.className).toContain('tw:whitespace-normal');
  });
});
