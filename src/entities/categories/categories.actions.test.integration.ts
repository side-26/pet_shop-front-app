import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  createCategoryAction,
  deleteCategoryAction,
  disableCategoryAction,
  enableCategoryAction,
  getAllCategoriesAction,
  getCategoryByIdAction,
  updateCategoryAction,
} from './categories.actions';
import * as service from './categories.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./categories.service', () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  disableCategory: vi.fn(),
  enableCategory: vi.fn(),
  getAllCategories: vi.fn(),
  getCategoryById: vi.fn(),
  updateCategory: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439012';
const petType = '507f1f77bcf86cd799439011';
const mainImage = new File(['image'], 'category.webp', { type: 'image/webp' });
const success = { isSuccess: true as const, message: 'ok', data: {} as never };

function session(role: AuthSessionModel['role']): AuthSessionModel {
  return {
    accessExp: 1,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    role,
    sessionExp: 2,
    userId: 'user-1',
  };
}

describe('category actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('allows any authenticated role to validate and get the category list', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    vi.mocked(service.getAllCategories).mockResolvedValue(success);

    await expect(
      getAllCategoriesAction({ includeDisabled: 'true', petType, unknown: 'removed' }),
    ).resolves.toBe(success);
    expect(service.getAllCategories).toHaveBeenCalledWith({ includeDisabled: true, petType });
  });

  it('rejects unauthenticated list access and malformed list filters', async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(getAllCategoriesAction()).resolves.toMatchObject({
      isSuccess: false,
      message: 'برای مشاهده دسته‌بندی‌ها وارد حساب شوید.',
    });

    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(getAllCategoriesAction({ petType: 'invalid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.getAllCategories).not.toHaveBeenCalled();
  });

  it('validates and gets a category detail for an admin', async () => {
    vi.mocked(service.getCategoryById).mockResolvedValue(success);

    await expect(getCategoryByIdAction({ id: `  ${id}  ` })).resolves.toBe(success);
    expect(service.getCategoryById).toHaveBeenCalledWith(id);
  });

  it('validates and creates a category with backend defaults', async () => {
    vi.mocked(service.createCategory).mockResolvedValue(success);

    await expect(
      createCategoryAction({ title: '  غذای خشک  ', petType, mainImage, unknown: 'removed' }),
    ).resolves.toBe(success);
    expect(service.createCategory).toHaveBeenCalledWith({
      title: 'غذای خشک',
      petType,
      mainImage,
      isEnable: true,
    });
  });

  it('validates id and update body fields while allowing an unchanged image', async () => {
    vi.mocked(service.updateCategory).mockResolvedValue(success);

    await expect(
      updateCategoryAction({ id, title: 'اسباب‌بازی', petType, mainImage, isEnable: false }),
    ).resolves.toBe(success);
    expect(service.updateCategory).toHaveBeenCalledWith(id, {
      title: 'اسباب‌بازی',
      petType,
      mainImage,
    });

    await expect(updateCategoryAction({ id, title: 'اسباب‌بازی', petType })).resolves.toBe(success);
    expect(service.updateCategory).toHaveBeenLastCalledWith(id, {
      title: 'اسباب‌بازی',
      petType,
    });
  });

  it.each([
    [enableCategoryAction, service.enableCategory],
    [disableCategoryAction, service.disableCategory],
    [deleteCategoryAction, service.deleteCategory],
  ] as const)('validates ids before category row mutations', async (action, serviceAction) => {
    vi.mocked(serviceAction).mockResolvedValue(success as never);

    await expect(action({ id })).resolves.toBe(success);
    expect(serviceAction).toHaveBeenCalledWith(id);

    await expect(action({ id: 'invalid' })).resolves.toMatchObject({ isSuccess: false });
    expect(serviceAction).toHaveBeenCalledOnce();
  });

  it.each([
    getCategoryByIdAction,
    createCategoryAction,
    updateCategoryAction,
    enableCategoryAction,
    disableCategoryAction,
    deleteCategoryAction,
  ])('rejects non-admin management calls', async (action) => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));

    await expect(action({ id, title: 'غذای خشک', petType, mainImage })).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه مدیریت دسته‌بندی‌ها را ندارید.',
    });
  });
});
