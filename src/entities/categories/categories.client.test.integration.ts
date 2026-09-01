import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  updateCategoryAction,
} from './categories.actions';
import {
  submitCategoryEnabledUpdate,
  submitCreateCategory,
  submitDeleteCategory,
  submitUpdateCategory,
} from './categories.client';

vi.mock('./categories.actions', () => ({
  createCategoryAction: vi.fn(),
  deleteCategoryAction: vi.fn(),
  disableCategoryAction: vi.fn(),
  enableCategoryAction: vi.fn(),
  updateCategoryAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = {
  title: 'غذای خشک',
  petType: '507f1f77bcf86cd799439011',
  mainImage: new File(['image'], 'category.webp', { type: 'image/webp' }),
  isEnable: true,
};
const updateInput = {
  title: input.title,
  petType: input.petType,
  mainImage: input.mainImage,
};
const error = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [{ value: 'title', label: 'عنوان تکراری است.' }], details: {} },
};

describe('category client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a category, shows the backend message, and reports success', async () => {
    vi.mocked(createCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'دسته‌بندی ایجاد شد.',
      data: {} as never,
    });

    await expect(submitCreateCategory(input, vi.fn())).resolves.toBe(true);
    expect(createCategoryAction).toHaveBeenCalledWith(input);
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'دسته‌بندی ایجاد شد.' });
  });

  it('passes complete create errors to the shared field handler', async () => {
    const setError = vi.fn();
    vi.mocked(createCategoryAction).mockResolvedValue(error);

    await expect(submitCreateCategory(input, setError)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toast.add).not.toHaveBeenCalled();
  });

  it('updates a category and forwards the exact form payload', async () => {
    vi.mocked(updateCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'دسته‌بندی ویرایش شد.',
      data: {} as never,
    });

    await expect(submitUpdateCategory(id, updateInput, vi.fn())).resolves.toBe(true);
    expect(updateCategoryAction).toHaveBeenCalledWith({ id, ...updateInput });
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'دسته‌بندی ویرایش شد.' });
  });

  it.each([
    [true, enableCategoryAction],
    [false, disableCategoryAction],
  ] as const)('calls the matching status action and shows its message', async (enabled, action) => {
    vi.mocked(action).mockResolvedValue({
      isSuccess: true,
      message: 'وضعیت دسته‌بندی تغییر کرد.',
      data: {} as never,
    });

    await expect(submitCategoryEnabledUpdate(id, enabled)).resolves.toBe(true);
    expect(action).toHaveBeenCalledWith({ id });
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'وضعیت دسته‌بندی تغییر کرد.',
    });
  });

  it('deletes a category and shows the backend message', async () => {
    vi.mocked(deleteCategoryAction).mockResolvedValue({
      isSuccess: true,
      message: 'دسته‌بندی حذف شد.',
      data: { id },
    });

    await expect(submitDeleteCategory(id)).resolves.toBe(true);
    expect(deleteCategoryAction).toHaveBeenCalledWith({ id });
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'دسته‌بندی حذف شد.' });
  });

  it('passes complete row-action errors to the shared error handler', async () => {
    vi.mocked(disableCategoryAction).mockResolvedValue(error);
    vi.mocked(deleteCategoryAction).mockResolvedValue(error);

    await expect(submitCategoryEnabledUpdate(id, false)).resolves.toBe(false);
    await expect(submitDeleteCategory(id)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, error);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, error);
    expect(toast.add).not.toHaveBeenCalled();
  });
});
