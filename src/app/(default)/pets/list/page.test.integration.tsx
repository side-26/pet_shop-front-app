import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetListRenderer } from './_components/pet-list-renderer';
import { petListSkeletonData } from './_components/pet-list-skeleton-data';
import { metadata } from './page';

const { toggleWishlistItemMock } = vi.hoisted(() => ({ toggleWishlistItemMock: vi.fn() }));

vi.mock('@/hooks/use-router', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
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
vi.mock('@/entities/users/users.client', () => ({
  useWishlist: () => ({ data: [] }),
  useWishlistToggle: () => ({ isPending: false, toggleWishlistItem: toggleWishlistItemMock }),
  wishlistItemId: (entry: { item: string }) => entry.item,
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
  vi.unstubAllGlobals();
  toggleWishlistItemMock.mockReset();
});

function renderPetListRenderer(
  props: Readonly<{
    data: LandingPetListPageDTO;
    isSkeleton?: boolean;
    query: Readonly<Record<string, string>>;
  }>,
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PetListRenderer {...props} />
    </QueryClientProvider>,
  );
}

describe(routePaths.petsList, () => {
  it('renders the shared catalogue skeleton from its view-model data', () => {
    renderPetListRenderer({ data: petListSkeletonData, isSkeleton: true, query: {} });

    expect(screen.getAllByRole('heading', { name: 'عنوان نمونه حیوان' })).toHaveLength(8);
  });

  it('renders live pet data inside the shared scroll-pagination composition', () => {
    renderPetListRenderer({ data, query: {} });

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

  it('toggles each pet card through the shared optimistic wishlist mutation', () => {
    renderPetListRenderer({ data, query: {} });

    fireEvent.click(screen.getByRole('button', { name: 'افزودن مکس به علاقه‌مندی‌ها' }));

    expect(toggleWishlistItemMock).toHaveBeenCalledWith({ itemId: 'pet-1', itemType: 'pet' });
  });

  it('exposes mobile and tablet filters and sorting drawer actions', () => {
    renderPetListRenderer({ data, query: {} });
    expect(screen.getByRole('button', { name: 'فیلترها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مرتب‌سازی' })).toBeTruthy();
  });

  it('uses the landing API dynamic filter and sort metadata in its mobile drawers', async () => {
    renderPetListRenderer({ data, query: {} });

    fireEvent.click(screen.getByRole('button', { name: 'فیلترها' }));
    const filterDrawer = await screen.findByRole('dialog', { name: 'فیلتر حیوانات' });
    expect(within(filterDrawer).getByRole('button', { name: 'نوع حیوان' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    fireEvent.click(screen.getByRole('button', { name: 'مرتب‌سازی' }));
    const sortDrawer = await screen.findByRole('dialog', { name: 'مرتب‌سازی' });
    expect(within(sortDrawer).getByRole('button', { name: 'جدیدترین' })).toBeTruthy();
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست حیوانات خانگی | پت شاپ پرشین');
  });
});
