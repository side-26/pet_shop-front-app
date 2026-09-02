import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import type { CategoryDTO } from '@/entities/categories/categories.dto';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { CategoriesTableContainer } from './_components/categories-table-container';
import { mapCategoriesTableRows } from './_components/categories-table.mapper';
import { categoriesTableSkeletonData } from './_components/categories-table-skeleton-data';
import { CategoriesTable } from './_components/categories-table';
import { CategoriesTableWrapper } from './_components/categories-table-wrapper';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/categories/categories.actions', () => ({
  getAllCategoriesAction: vi.fn(() => new Promise(() => undefined)),
  getCategoryByIdAction: vi.fn(),
  deleteCategoryAction: vi.fn(),
}));
vi.mock('@/entities/pet-types/pet-types.actions', () => ({
  getAllPetTypesAction: vi.fn(() => new Promise(() => undefined)),
}));

const category: CategoryDTO = {
  id: '507f1f77bcf86cd799439012',
  title: 'غذای خشک',
  petType: '507f1f77bcf86cd799439011',
  mainImage: 'https://cdn.example.test/category.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  slug: 'dry-food',
  isEnable: true,
  createdAt: '2026-08-31T00:00:00.000Z',
  updatedAt: '2026-08-31T00:00:00.000Z',
};
const petType = {
  id: category.petType,
  title: 'سگ',
  description: '',
  mainImage: '',
  thumbnail: '',
  isEnabled: true,
  propertyDefinitions: [],
  slug: 'dog',
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
};

afterEach(cleanup);

describe(routePaths.adminCategories, () => {
  it('renders the shared table renderer as a busy, non-interactive skeleton', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <CategoriesTable categories={categoriesTableSkeletonData} isSkeleton />
      </DirectionProvider>,
    );

    expect(container.querySelector('section')?.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('section')?.className).toContain('skeleton');
    expect(
      screen
        .getAllByRole('switch')
        .every(
          (control) =>
            control.matches(':disabled') || control.getAttribute('aria-disabled') === 'true',
        ),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('button', { name: /عملیات/ })
        .every((button) => button.matches(':disabled')),
    ).toBe(true);
  });

  it('maps pet type titles and uses the thumbnail data URL as the avatar placeholder', async () => {
    const content = await CategoriesTableContainer({
      categoriesPromise: Promise.resolve({ isSuccess: true, message: null, data: [category] }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [petType] }),
    });
    const [row] = mapCategoriesTableRows([category], new Map([[petType.id, petType.title]]));

    const { container } = render(<DirectionProvider direction="rtl">{content}</DirectionProvider>);
    expect(row.petTypeTitle).toBe('سگ');
    expect(screen.getByText('سگ')).toBeTruthy();
    expect(screen.getByText('سگ').className).toContain('tw:line-clamp-2');
    expect(screen.getByRole('switch', { name: 'غذای خشک: فعال' })).toBeTruthy();
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('style')).toContain(
      category.mainThumbnailImage,
    );
  });

  it('normalizes list errors and starts both table requests in the wrapper', async () => {
    const error = await CategoriesTableContainer({
      categoriesPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطای سرور',
        data: { messages: {}, details: {} },
      }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    render(<DirectionProvider direction="rtl">{error}</DirectionProvider>);
    expect(screen.getByText('دریافت دسته‌بندی‌ها انجام نشد')).toBeTruthy();

    CategoriesTableWrapper();
    expect(vi.mocked(getAllCategoriesAction)).toHaveBeenCalledWith({ includeDisabled: true });
    expect(vi.mocked(getAllPetTypesAction)).toHaveBeenCalledWith({ includeDisabled: true });
  });
});
