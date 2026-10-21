import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { ReactQueryProvider } from '@/app/react-query-provider';
import { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import type { CategoryDTO } from '@/entities/categories/categories.dto';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import { getAllSubCategoriesAction } from '@/entities/sub-categories/sub-categories.actions';
import type { SubCategoryDTO } from '@/entities/sub-categories/sub-categories.dto';

import { SubCategoriesTableContainer } from './_components/sub-categories-table-container';
import { subCategoriesTableSkeletonData } from './_components/sub-categories-table-skeleton-data';
import { SubCategoriesTableWrapper } from './_components/sub-categories-table-wrapper';
import { SubCategoriesTable } from './_components/sub-categories-table';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/sub-categories/sub-categories.actions', () => ({
  getAllSubCategoriesAction: vi.fn(() => new Promise(() => undefined)),
  getSubCategoryByIdAction: vi.fn(),
  deleteSubCategoryAction: vi.fn(),
}));
vi.mock('@/entities/categories/categories.actions', () => ({
  getAllCategoriesAction: vi.fn(() => new Promise(() => undefined)),
}));
vi.mock('@/entities/pet-types/pet-types.actions', () => ({
  getAllPetTypesAction: vi.fn(() => new Promise(() => undefined)),
}));

const petTypeId = '507f1f77bcf86cd799439010';
const categoryId = '507f1f77bcf86cd799439011';
const subCategoryId = '507f1f77bcf86cd799439012';
const timestamp = '2026-09-01T00:00:00.000Z';
const category: CategoryDTO = {
  id: categoryId,
  title: 'غذا',
  petType: petTypeId,
  mainImage: '',
  mainThumbnailImage: '',
  slug: 'food',
  isEnable: true,
  createdAt: timestamp,
  updatedAt: timestamp,
};
const subCategory: SubCategoryDTO = {
  id: subCategoryId,
  title: 'غذای خشک',
  category: categoryId,
  createdAt: timestamp,
  updatedAt: timestamp,
};
const petType = {
  id: petTypeId,
  title: 'سگ',
  description: '',
  mainImage: '',
  thumbnail: '',
  isEnabled: true,
  propertyDefinitions: [],
  slug: 'dog',
  createdAt: timestamp,
  updatedAt: timestamp,
};

afterEach(cleanup);

describe(routePaths.adminSubCategories, () => {
  it('renders the shared table renderer as a busy non-interactive skeleton', () => {
    const { container } = render(
      <ReactQueryProvider>
        <DirectionProvider direction="rtl">
          <SubCategoriesTable rows={subCategoriesTableSkeletonData} isSkeleton />
        </DirectionProvider>
      </ReactQueryProvider>,
    );

    const section = container.querySelector('section');
    expect(section?.getAttribute('aria-busy')).toBe('true');
    expect(section?.className).toContain('skeleton');
    expect(
      screen
        .getAllByRole('button', { name: /عملیات/ })
        .every((button) => button.matches(':disabled')),
    ).toBe(true);
  });

  it('resolves the requested pet-type title through the parent category', async () => {
    const content = await SubCategoriesTableContainer({
      subCategoriesPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: [subCategory],
      }),
      categoriesPromise: Promise.resolve({ isSuccess: true, message: null, data: [category] }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [petType] }),
    });

    render(
      <ReactQueryProvider>
        <DirectionProvider direction="rtl">{content}</DirectionProvider>
      </ReactQueryProvider>,
    );
    expect(screen.getByText('غذای خشک')).toBeTruthy();
    expect(screen.getByText('غذای خشک').className).toContain('tw:line-clamp-2');
    expect(screen.getByText('غذا')).toBeTruthy();
    expect(screen.getByText('سگ')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'عملیات غذای خشک' })).toBeTruthy();
  });

  it('normalizes errors and starts all table requests before suspension', async () => {
    const error = await SubCategoriesTableContainer({
      subCategoriesPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطای سرور',
        data: { messages: {}, details: {} },
      }),
      categoriesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });

    render(
      <ReactQueryProvider>
        <DirectionProvider direction="rtl">{error}</DirectionProvider>
      </ReactQueryProvider>,
    );
    expect(screen.getByText('دریافت زیر دسته‌بندی‌ها انجام نشد')).toBeTruthy();

    SubCategoriesTableWrapper();
    expect(vi.mocked(getAllSubCategoriesAction)).toHaveBeenCalledWith();
    expect(vi.mocked(getAllCategoriesAction)).toHaveBeenCalledWith({ includeDisabled: true });
    expect(vi.mocked(getAllPetTypesAction)).toHaveBeenCalledWith({ includeDisabled: true });
  });
});
