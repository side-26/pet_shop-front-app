import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  getAllSubCategoriesAction,
  getSubCategoryByIdAction,
  updateSubCategoryAction,
} from './sub-categories.actions';
import * as service from './sub-categories.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./sub-categories.service', () => ({
  createSubCategory: vi.fn(),
  deleteSubCategory: vi.fn(),
  getAllSubCategories: vi.fn(),
  getSubCategoryById: vi.fn(),
  updateSubCategory: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439012';
const category = '507f1f77bcf86cd799439011';
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

describe('sub-category actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('allows any authenticated role to validate and get the filtered list', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    vi.mocked(service.getAllSubCategories).mockResolvedValue(success);

    await expect(
      getAllSubCategoriesAction({ category: `  ${category}  `, unknown: 'removed' }),
    ).resolves.toBe(success);
    expect(service.getAllSubCategories).toHaveBeenCalledWith({ category });
  });

  it('rejects unauthenticated list access and malformed filters', async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(getAllSubCategoriesAction()).resolves.toMatchObject({
      isSuccess: false,
      message: 'برای مشاهده زیر دسته‌بندی‌ها وارد حساب شوید.',
    });

    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(getAllSubCategoriesAction({ category: 'invalid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.getAllSubCategories).not.toHaveBeenCalled();
  });

  it('validates and gets detail for an admin', async () => {
    vi.mocked(service.getSubCategoryById).mockResolvedValue(success);

    await expect(getSubCategoryByIdAction({ id: `  ${id}  ` })).resolves.toBe(success);
    expect(service.getSubCategoryById).toHaveBeenCalledWith(id);
  });

  it('validates, normalizes, and creates a sub-category', async () => {
    vi.mocked(service.createSubCategory).mockResolvedValue(success);

    await expect(
      createSubCategoryAction({ title: '  غذای خشک  ', category, unknown: 'removed' }),
    ).resolves.toBe(success);
    expect(service.createSubCategory).toHaveBeenCalledWith({ title: 'غذای خشک', category });
  });

  it('validates id and the complete update body', async () => {
    vi.mocked(service.updateSubCategory).mockResolvedValue(success);

    await expect(
      updateSubCategoryAction({ id, title: '  غذای ویژه  ', category, unknown: 'removed' }),
    ).resolves.toBe(success);
    expect(service.updateSubCategory).toHaveBeenCalledWith(id, {
      title: 'غذای ویژه',
      category,
    });

    await expect(updateSubCategoryAction({ id, title: 'غذای ویژه' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.updateSubCategory).toHaveBeenCalledOnce();
  });

  it('validates ids before deletion', async () => {
    vi.mocked(service.deleteSubCategory).mockResolvedValue(success as never);

    await expect(deleteSubCategoryAction({ id })).resolves.toBe(success);
    expect(service.deleteSubCategory).toHaveBeenCalledWith(id);

    await expect(deleteSubCategoryAction({ id: 'invalid' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(service.deleteSubCategory).toHaveBeenCalledOnce();
  });

  it.each([
    getSubCategoryByIdAction,
    createSubCategoryAction,
    updateSubCategoryAction,
    deleteSubCategoryAction,
  ])('rejects non-admin management calls', async (action) => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));

    await expect(action({ id, title: 'غذای خشک', category })).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه مدیریت زیر دسته‌بندی‌ها را ندارید.',
    });
  });
});
