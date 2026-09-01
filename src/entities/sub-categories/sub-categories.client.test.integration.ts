import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  updateSubCategoryAction,
} from './sub-categories.actions';
import {
  submitCreateSubCategory,
  submitDeleteSubCategory,
  submitUpdateSubCategory,
} from './sub-categories.client';

vi.mock('./sub-categories.actions', () => ({
  createSubCategoryAction: vi.fn(),
  deleteSubCategoryAction: vi.fn(),
  updateSubCategoryAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = { title: 'غذای خشک', category: '507f1f77bcf86cd799439011' };
const error = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [{ value: 'title', label: 'عنوان تکراری است.' }], details: {} },
};

describe('sub-category client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates, shows the backend message, and reports success', async () => {
    vi.mocked(createSubCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'زیر دسته‌بندی ایجاد شد.',
      data: {} as never,
    });

    await expect(submitCreateSubCategory(input, vi.fn())).resolves.toBe(true);
    expect(createSubCategoryAction).toHaveBeenCalledWith(input);
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'زیر دسته‌بندی ایجاد شد.',
    });
  });

  it('passes complete create errors to the shared field handler', async () => {
    const setError = vi.fn();
    vi.mocked(createSubCategoryAction).mockResolvedValue(error);

    await expect(submitCreateSubCategory(input, setError)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toast.add).not.toHaveBeenCalled();
  });

  it('updates and forwards the exact payload', async () => {
    vi.mocked(updateSubCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'زیر دسته‌بندی ویرایش شد.',
      data: {} as never,
    });

    await expect(submitUpdateSubCategory(id, input, vi.fn())).resolves.toBe(true);
    expect(updateSubCategoryAction).toHaveBeenCalledWith({ id, ...input });
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'زیر دسته‌بندی ویرایش شد.',
    });
  });

  it('deletes and shows the backend message', async () => {
    vi.mocked(deleteSubCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'زیر دسته‌بندی حذف شد.',
      data: { id },
    });

    await expect(submitDeleteSubCategory(id)).resolves.toBe(true);
    expect(deleteSubCategoryAction).toHaveBeenCalledWith({ id });
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'زیر دسته‌بندی حذف شد.',
    });
  });

  it('passes complete update and delete errors to the shared handler', async () => {
    const setError = vi.fn();
    vi.mocked(updateSubCategoryAction).mockResolvedValue(error);
    vi.mocked(deleteSubCategoryAction).mockResolvedValue(error);

    await expect(submitUpdateSubCategory(id, input, setError)).resolves.toBe(false);
    await expect(submitDeleteSubCategory(id)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, error, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, error);
    expect(toast.add).not.toHaveBeenCalled();
  });
});
