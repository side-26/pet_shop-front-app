import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductListRenderer } from './_components/product-list-renderer';
import { ProductInfiniteList } from './_components/product-infinite-list';
import { metadata } from './page';

const push = vi.fn();
const { getLandingProductListAction } = vi.hoisted(() => ({
  getLandingProductListAction: vi.fn(),
}));
vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));
vi.mock('@/entities/landing/landing.actions', () => ({ getLandingProductListAction }));
vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    children,
    hasMore,
    next,
  }: {
    children: React.ReactNode;
    hasMore: boolean;
    next: () => void;
  }) => (
    <div>
      {children}
      <button disabled={!hasMore} onClick={next} type="button">
        بارگذاری بیشتر
      </button>
    </div>
  ),
}));

const data: LandingProductListPageDTO = {
  result: [
    {
      id: 'product-1',
      title: 'غذای خشک گربه',
      mainImage: 'https://cdn.example.com/product.webp',
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      price: 200_000,
      discountPercentage: 10,
      slug: 'cat-food',
      discountPrice: 180_000,
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
};

const filteredData: LandingProductListPageDTO = {
  ...data,
  filters: [
    {
      key: 'price',
      label: 'قیمت',
      order: 1,
      type: 'range',
      min: 100,
      max: 200,
      unit: 'تومان',
    },
    {
      key: 'available',
      label: 'فقط کالاهای موجود',
      order: 2,
      type: 'boolean',
      options: [{ value: true, label: 'فقط کالاهای موجود', count: 1 }],
    },
  ],
  sort: {
    current: 'most-sales',
    options: [
      { value: 'most-sales', label: 'پرفروش‌ترین' },
      { value: 'most-valued', label: 'گران‌ترین' },
    ],
  },
};

afterEach(() => {
  cleanup();
  push.mockClear();
  getLandingProductListAction.mockReset();
});

describe(routePaths.productsList, () => {
  it('renders API-driven landing products without legacy page navigation', () => {
    render(<ProductListRenderer data={data} query={{ brand: 'royal-canin' }} />);

    expect(screen.getByRole('complementary', { name: 'فیلتر محصولات' })).toBeTruthy();
    expect(screen.getByText('فیلتری برای این فهرست در دسترس نیست.')).toBeTruthy();
    expect(screen.getByText('مرتب‌سازی برای این فهرست در دسترس نیست.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'غذای خشک گربه' })).toBeTruthy();
    expect(screen.getAllByText('تومان').length).toBe(2);
    expect(screen.queryByRole('link', { name: 'صفحه ۲' })).toBeNull();
    expect(screen.getByRole('link', { name: 'مشاهده محصول' }).getAttribute('href')).toBe(
      routePaths.productDetail('cat-food'),
    );
  });

  it('keeps API-metadata controls inert when the endpoint does not return metadata', () => {
    render(<ProductListRenderer data={data} query={{}} />);
    expect(screen.getByRole('button', { name: 'اعمال فیلترها' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'پاک کردن' }).hasAttribute('disabled')).toBe(true);
  });

  it('maps backend price facets to priceFrom and priceTo without adding URL pagination', () => {
    render(
      <ProductListRenderer data={filteredData} query={{ priceFrom: '100', priceTo: '200' }} />,
    );

    fireEvent.change(screen.getByLabelText('از تومان'), { target: { value: '120' } });
    fireEvent.click(screen.getByRole('button', { name: 'اعمال فیلترها' }));

    expect(push).toHaveBeenCalledWith('/products/list?priceFrom=120&priceTo=200', {
      scroll: false,
    });
  });

  it('loads the next page through the Server Action without adding page or limit to its query', async () => {
    getLandingProductListAction.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {
        ...data,
        result: [{ ...data.result[0], id: 'product-2', title: 'غذای خشک سگ', slug: 'dog-food' }],
        pagination: { ...data.pagination, currentPage: 2, hasNextPage: false, nextPage: null },
      },
    });

    render(<ProductInfiniteList data={data} query={{ brand: 'royal-canin' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری بیشتر' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'غذای خشک سگ' })).toBeTruthy());
    expect(getLandingProductListAction).toHaveBeenCalledWith({ brand: 'royal-canin', page: 2 });
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست محصولات حیوانات خانگی | پت شاپ پرشین');
  });
});
