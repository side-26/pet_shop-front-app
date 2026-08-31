import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { getBreedsPageAction } from '@/entities/breeds/breeds.actions';
import type { BreedDTO, BreedsPageDTO } from '@/entities/breeds/breeds.dto';
import { getCountriesAction } from '@/entities/countries/countries.actions';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { BreedsPaginateTable } from './_components/breeds-paginate-table';
import { BreedsTableContainer } from './_components/breeds-table-container';
import { mapBreedsPageViewModel } from './_components/breeds-table.mapper';
import { breedsTableSkeletonData } from './_components/breeds-table-skeleton-data';
import { BreedsTableWrapper } from './_components/breeds-table-wrapper';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/entities/breeds/breeds.actions', () => ({
  getBreedsPageAction: vi.fn(() => new Promise(() => undefined)),
  getBreedAction: vi.fn(),
  getBreedPropertyDefinitionsAction: vi.fn(),
  deleteBreedAction: vi.fn(),
}));
vi.mock('@/entities/pet-types/pet-types.actions', () => ({
  getAllPetTypesAction: vi.fn(() => new Promise(() => undefined)),
}));
vi.mock('@/entities/countries/countries.actions', () => ({
  getCountriesAction: vi.fn(() => new Promise(() => undefined)),
}));

const breed: BreedDTO = {
  id: '507f1f77bcf86cd799439012',
  title: 'گلدن رتریور',
  petType: '507f1f77bcf86cd799439011',
  petTypeTitle: 'سگ',
  country: 'اسکاتلند',
  ageAverage: '۱۰ تا ۱۲ سال',
  size: 4,
  activityLevel: 4,
  propertyDefinitions: [],
  mainImage: 'https://cdn.example.test/breeds/golden.webp',
  thumbnailImage: 'data:image/webp;base64,thumbnail',
  enable: true,
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-29T00:00:00.000Z',
};

const page: BreedsPageDTO = {
  result: [breed],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe(routePaths.adminBreeds, () => {
  it('renders the shared table renderer as a disabled, stable skeleton', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <BreedsPaginateTable
          breeds={breedsTableSkeletonData}
          page={1}
          pageCount={1}
          total={5}
          isLoading
        />
      </DirectionProvider>,
    );

    const region = container.querySelector('section')!;
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('skeleton');
    expect(
      screen
        .getAllByRole('switch')
        .every(
          (control) =>
            control.hasAttribute('disabled') || control.getAttribute('aria-disabled') === 'true',
        ),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('button', { name: /عملیات/ })
        .every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
  });

  it('maps the API page, uses the thumbnail as avatar placeholder, and renders empty/error states', async () => {
    const loaded = await BreedsTableContainer({
      breedsPromise: Promise.resolve({ isSuccess: true, message: null, data: page }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
      query: {},
    });
    const empty = await BreedsTableContainer({
      breedsPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: { ...page, result: [], pagination: { ...page.pagination, totalItems: 0 } },
      }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
      query: {},
    });
    const error = await BreedsTableContainer({
      breedsPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطا در ارتباط با سرور',
        data: { messages: {}, details: {} },
      }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
      query: {},
    });

    const { container, rerender } = render(
      <DirectionProvider direction="rtl">{loaded}</DirectionProvider>,
    );
    expect(screen.getByText(breed.title)).toBeTruthy();
    expect(screen.getByText('سگ')).toBeTruthy();
    expect(screen.getAllByRole('columnheader')).toHaveLength(9);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('style')).toContain(
      breed.thumbnailImage,
    );

    rerender(<DirectionProvider direction="rtl">{empty}</DirectionProvider>);
    expect(screen.getByText('نژادی پیدا نشد')).toBeTruthy();
    rerender(<DirectionProvider direction="rtl">{error}</DirectionProvider>);
    expect(screen.getByText('دریافت نژادها انجام نشد')).toBeTruthy();
    expect(screen.getByText('خطا در ارتباط با سرور')).toBeTruthy();
  });

  it('keeps mapping pure and starts all table requests in the wrapper', () => {
    const viewModel = mapBreedsPageViewModel(page, new Map([[breed.petType, 'سگ']]));
    expect(viewModel.breeds[0]).toMatchObject({
      title: breed.title,
      petTypeTitle: breed.petTypeTitle,
      mainImage: breed.mainImage,
      thumbnailImage: breed.thumbnailImage,
      isEnabled: true,
    });

    BreedsTableWrapper({
      page: 1,
      query: { includeDisabled: true, page: 1, limit: 10, sort: 'title' },
    });
    expect(vi.mocked(getBreedsPageAction)).toHaveBeenCalledWith({
      includeDisabled: true,
      page: 1,
      limit: 10,
      sort: 'title',
    });
    expect(vi.mocked(getAllPetTypesAction)).toHaveBeenCalledWith({ includeDisabled: true });
    expect(vi.mocked(getCountriesAction)).toHaveBeenCalledOnce();
  });

  it('uses the loaded pet-type title when the breed page omits it', () => {
    const data = {
      ...page,
      result: [{ ...breed, petTypeTitle: undefined }],
    };

    expect(
      mapBreedsPageViewModel(data, new Map([[breed.petType, 'سگ']])).breeds[0].petTypeTitle,
    ).toBe('سگ');
  });
});
