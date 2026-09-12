import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { CustomerProductsPageDTO } from '@/entities/products/products.dto';

import { ProductListRenderer } from './_components/product-list-renderer';
import { metadata } from './page';

const push = vi.fn();
vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));

const data: CustomerProductsPageDTO = {
  result: [
    {
      id: 'product-1',
      title: 'غذای خشک گربه',
      mainImage: 'https://cdn.example.com/product.webp',
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      description: { type: 'doc', content: [] },
      quantity: 3,
      price: 200_000,
      discountPercentage: 10,
      isEnable: true,
      slug: 'cat-food',
      category: 'غذا',
      brand: 'رویال کنین',
      subCategory: null,
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalItems: 3,
    itemsPerPage: 1,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null,
  },
  filters: [
    {
      key: 'brand',
      label: 'برند',
      order: 1,
      type: 'multi-select',
      options: [{ value: 'royal-canin', label: 'رویال کنین', count: 3 }],
    },
  ],
  sort: {
    current: 'createdAt',
    options: [
      { value: 'createdAt', label: 'جدیدترین' },
      { value: 'price', label: 'ارزان‌ترین' },
    ],
  },
};

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe(routePaths.productsList, () => {
  it('renders API-driven products, filters, sort metadata, prices, and paging links', () => {
    render(<ProductListRenderer data={data} query={{ brand: 'royal-canin' }} />);

    expect(screen.getByRole('complementary', { name: 'فیلتر محصولات' })).toBeTruthy();
    expect(screen.getAllByText('برند').length).toBeGreaterThan(0);
    expect(screen.getAllByText('جدیدترین').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'غذای خشک گربه' })).toBeTruthy();
    expect(screen.getAllByText('تومان').length).toBe(2);
    expect(screen.getByRole('link', { name: 'صفحه ۲' }).getAttribute('href')).toBe(
      '/products/list?brand=royal-canin&page=2',
    );
    expect(screen.getByRole('link', { name: 'مشاهده محصول' }).getAttribute('href')).toBe(
      routePaths.productDetail('cat-food'),
    );
  });

  it('uses API filter groups as collapsible controls', () => {
    render(<ProductListRenderer data={data} query={{}} />);
    const triggers = screen.getAllByRole('button', { name: 'برند' });
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(triggers[0]);
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست محصولات حیوانات خانگی | پت شاپ پرشین');
  });
});
