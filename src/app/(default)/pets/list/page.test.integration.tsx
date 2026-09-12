import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { CustomerPetDetailsPageDTO } from '@/entities/pets/pets.dto';

import { PetListRenderer } from './_components/pet-list-renderer';
import { metadata } from './page';

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const data: CustomerPetDetailsPageDTO = {
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
      images: [],
      petType: { id: 'dog', title: 'سگ' },
      breed: { id: 'golden', title: 'گلدن رتریور' },
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
      type: 'select',
      options: [{ value: 'dog', label: 'سگ', count: 1 }],
    },
  ],
  sort: { current: 'createdAt', options: [{ value: 'createdAt', label: 'جدیدترین' }] },
};

afterEach(cleanup);

describe(routePaths.petsList, () => {
  it('renders live pet data inside the shared pagination composition', () => {
    render(<PetListRenderer data={data} query={{}} />);

    expect(screen.getByRole('complementary', { name: 'فیلتر حیوانات' })).toBeTruthy();
    expect(screen.getByTestId('pets-grid').className).toContain('tw:md:grid-cols-3');
    expect(screen.getByRole('heading', { name: 'مکس' })).toBeTruthy();
    expect(screen.getByText('گلدن رتریور')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مشاهده جزئیات' }).getAttribute('href')).toBe(
      routePaths.petDetail('max'),
    );
  });

  it('exposes mobile and tablet filters and sorting as dialog actions', () => {
    render(<PetListRenderer data={data} query={{}} />);
    expect(screen.getByRole('button', { name: 'فیلترها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مرتب‌سازی' })).toBeTruthy();
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست حیوانات خانگی | پت شاپ پرشین');
  });
});
