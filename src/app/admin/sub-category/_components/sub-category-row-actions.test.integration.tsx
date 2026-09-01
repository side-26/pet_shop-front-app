import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import {
  deleteSubCategoryAction,
  getSubCategoryByIdAction,
} from '@/entities/sub-categories/sub-categories.actions';
import type { SubCategoryDTO } from '@/entities/sub-categories/sub-categories.dto';
import { useCommonStore } from '@/stores/common.store';

import { SubCategoryDetailFormBody } from './sub-category-detail-dialog-content-wrapper';
import { SubCategoryRowActions } from './sub-category-row-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/entities/sub-categories/sub-categories.actions', () => ({
  deleteSubCategoryAction: vi.fn(),
  getSubCategoryByIdAction: vi.fn(),
}));
vi.mock('@/entities/sub-categories/sub-categories.client', () => ({
  useUpdateSubCategory: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const category = '507f1f77bcf86cd799439011';
const subCategory: SubCategoryDTO = {
  id: '507f1f77bcf86cd799439012',
  title: 'غذای خشک',
  category,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};
const categories = [
  {
    value: category,
    title: 'غذا',
    mainImage: 'https://cdn.example.test/categories/food.webp',
    mainThumbnailImage: 'data:image/webp;base64,AAAA',
  },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  useCommonStore.getState().hideConfirmDialog();
});

describe('SubCategoryRowActions', () => {
  it('renders the real disabled form content for the detail loading state', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <SubCategoryDetailFormBody
            formRef={{ current: null }}
            handleSubmit={vi.fn()}
            categories={categories}
            isSkeleton
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(document.querySelector('form[aria-busy="true"]')?.className).toContain('skeleton');
    expect(screen.getByLabelText('عنوان').matches(':disabled')).toBe(true);
    expect(screen.getByLabelText('دسته‌بندی').matches(':disabled')).toBe(true);
  });

  it('starts detail only after selection and replaces the fallback with API data', async () => {
    vi.mocked(getSubCategoryByIdAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: subCategory,
    });

    render(
      <DirectionProvider direction="rtl">
        <SubCategoryRowActions
          subCategoryId={subCategory.id}
          subCategoryTitle={subCategory.title}
          categories={categories}
        />
      </DirectionProvider>,
    );

    expect(getSubCategoryByIdAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'عملیات غذای خشک' }));
    await act(async () => fireEvent.click(await screen.findByText('مشاهده و ویرایش')));

    expect(getSubCategoryByIdAction).toHaveBeenCalledWith({ id: subCategory.id });
    expect(
      await screen.findByRole('dialog', { name: 'مشاهده و ویرایش زیر دسته‌بندی' }),
    ).toBeTruthy();
    expect(await screen.findByDisplayValue(subCategory.title)).toBeTruthy();
    expect(document.querySelector('[data-slot="avatar"]')?.getAttribute('style')).toContain(
      categories[0].mainThumbnailImage,
    );

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'مشاهده و ویرایش زیر دسته‌بندی' })).toBeNull(),
    );
  });

  it('requires confirmation before deleting and refreshes after success', async () => {
    vi.mocked(deleteSubCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'حذف شد',
      data: { id: subCategory.id },
    });

    render(
      <DirectionProvider direction="rtl">
        <SubCategoryRowActions
          subCategoryId={subCategory.id}
          subCategoryTitle={subCategory.title}
          categories={categories}
        />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات غذای خشک' }));
    fireEvent.click(await screen.findByText('حذف زیر دسته‌بندی'));
    expect(deleteSubCategoryAction).not.toHaveBeenCalled();
    expect(useCommonStore.getState().confirmDialog).toMatchObject({
      open: true,
      title: 'زیر دسته‌بندی حذف شود؟',
      variant: 'error',
    });

    await act(async () => useCommonStore.getState().confirmDialog.onSuccess());
    expect(deleteSubCategoryAction).toHaveBeenCalledWith({ id: subCategory.id });
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'حذف شد' });
    expect(refresh).toHaveBeenCalledOnce();
  });
});
