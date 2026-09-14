import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetInfiniteList } from './_components/pet-infinite-list';
import { PetListRenderer } from './_components/pet-list-renderer';
import { metadata } from './page';

const { getLandingPetListAction } = vi.hoisted(() => ({
  getLandingPetListAction: vi.fn(),
}));

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/entities/landing/landing.actions', () => ({ getLandingPetListAction }));
vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    children,
    endMessage,
    hasMore,
    next,
  }: {
    children: React.ReactNode;
    endMessage: React.ReactNode;
    hasMore: boolean;
    next: () => void;
  }) => (
    <div>
      {children}
      <button disabled={!hasMore} onClick={next} type="button">
        بارگذاری بیشتر
      </button>
      {!hasMore ? endMessage : null}
    </div>
  ),
}));

const data: LandingPetListPageDTO = {
  result: [
    {
      id: 'pet-1',
      title: 'مکس',
      mainImage: 'https://cdn.example.com/max.webp',
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      description: { type: 'doc', content: [] },
      quantity: 1,
      price: 5_000_000,
      discountPercentage: 0,
      inEnable: true,
      slug: 'max',
      petType: 'سگ',
      breed: 'گلدن رتریور',
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
  filters: [
    {
      key: 'petType',
      label: 'نوع حیوان',
      order: 1,
      type: 'multi-select',
      options: [{ value: 'dog', label: 'سگ', count: 1 }],
    },
  ],
  sort: { current: 'createdAt', options: [{ value: 'createdAt', label: 'جدیدترین' }] },
};

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  getLandingPetListAction.mockReset();
  vi.unstubAllGlobals();
});

describe(routePaths.petsList, () => {
  it('renders live pet data inside the shared scroll-pagination composition', () => {
    render(<PetListRenderer data={data} query={{}} />);

    expect(screen.getByRole('complementary', { name: 'فیلتر حیوانات' })).toBeTruthy();
    expect(screen.getByTestId('pets-grid').className).toContain('tw:md:grid-cols-3');
    expect(screen.getByRole('heading', { name: 'مکس' })).toBeTruthy();
    expect(screen.getByText('گلدن رتریور')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مشاهده جزئیات' }).getAttribute('href')).toBe(
      routePaths.petDetail('max'),
    );
    expect(screen.queryByRole('link', { name: 'صفحه ۲' })).toBeNull();
    expect(
      screen.getByRole('heading', { name: 'راهنمای انتخاب و خرید حیوانات خانگی' }),
    ).toBeTruthy();
    expect(
      screen.getByText(/در پت شاپ پرشین می‌توانید انواع حیوانات خانگی را بر اساس نوع، نژاد، سن/),
    ).toBeTruthy();
  });

  it('exposes mobile and tablet filters and sorting as dialog actions', () => {
    render(<PetListRenderer data={data} query={{}} />);
    expect(screen.getByRole('button', { name: 'فیلترها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مرتب‌سازی' })).toBeTruthy();
  });

  it('uses the landing API dynamic filter and sort metadata in its mobile dialogs', async () => {
    render(<PetListRenderer data={data} query={{}} />);

    fireEvent.click(screen.getByRole('button', { name: 'فیلترها' }));
    const filterDialog = await screen.findByRole('dialog', { name: 'فیلتر حیوانات' });
    expect(await screen.findByRole('button', { name: 'نوع حیوان' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    fireEvent.click(screen.getByRole('button', { name: 'مرتب‌سازی' }));
    const sortDialog = await screen.findByRole('dialog', { name: 'مرتب‌سازی' });
    expect(within(sortDialog).getByLabelText('در حال بارگذاری مرتب‌سازی')).toBeTruthy();
    expect(await screen.findByRole('button', { name: 'جدیدترین' })).toBeTruthy();
  });

  it('loads the next pet page through the Server Action without adding page or limit to its query', async () => {
    getLandingPetListAction.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {
        ...data,
        result: [{ ...data.result[0], id: 'pet-2', title: 'لونا', slug: 'luna' }],
        pagination: { ...data.pagination, currentPage: 2, hasNextPage: false, nextPage: null },
      },
    });

    render(
      <PetInfiniteList
        data={{ ...data, pagination: { ...data.pagination, hasNextPage: true } }}
        query={{ petType: 'dog' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری بیشتر' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'لونا' })).toBeTruthy());
    expect(getLandingPetListAction).toHaveBeenCalledWith({ page: 2, petType: 'dog' });
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست حیوانات خانگی | پت شاپ پرشین');
  });
});
