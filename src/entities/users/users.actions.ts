'use server';

import { ValidationError } from 'yup';

import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  createUserSchema,
  changeCurrentUserPasswordSchema,
  deleteUserByIdSchema,
  getAllPaginatedUsersSchema,
  updateUserStatusByIdSchema,
  updateCurrentUserProfileSchema,
  userGetDetailByIdSchema,
  addCartItemSchema,
  addWishlistItemSchema,
  cartEntryIdSchema,
  createUserAddressSchema,
  updateUserAddressSchema,
  userAddressIdSchema,
  wishlistEntryIdSchema,
  createDeliveryQuoteSchema,
  selectDeliveryWindowSchema,
} from './users.schema';
import {
  createUser,
  changeCurrentUserPassword,
  deleteUserById,
  disableUserById,
  enableUserById,
  getCurrentUser,
  getAllPaginatedUsers,
  getAllUsers,
  userGetDetailById,
  updateCurrentUserProfile,
  addCartItem,
  addUserAddress,
  addWishlistItem,
  deleteCartItem,
  deleteWishlistItem,
  emptyCart,
  getCart,
  getUserAddresses,
  getWishlist,
  updateUserAddress,
  createDeliveryQuote,
  selectDeliveryWindow,
} from './users.service';

const ALLOWED_ADMIN_ROLES = new Set<UserRole>([USER_ROLES.ADMIN]);

function accessError(message: string): FetcherError {
  return {
    isSuccess: false,
    message,
    data: { messages: {}, details: {} },
  };
}

export async function getCurrentUserAction() {
  const session = await getSession();

  if (!session) {
    return accessError('برای مشاهده حساب کاربری وارد شوید.');
  }

  return getCurrentUser();
}

export async function updateCurrentUserProfileAction(input: unknown) {
  const session = await getSession();
  if (!session) return accessError('برای ویرایش پروفایل وارد حساب کاربری شوید.');

  try {
    const value = await updateCurrentUserProfileSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return updateCurrentUserProfile(session.userId, value);
  } catch (error: unknown) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function changeCurrentUserPasswordAction(input: unknown) {
  const session = await getSession();
  if (!session) return accessError('برای تغییر کلمه عبور وارد حساب کاربری شوید.');

  try {
    const value = await changeCurrentUserPasswordSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return changeCurrentUserPassword(session.userId, value);
  } catch (error: unknown) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function userGetDetailByIdAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای مشاهده کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه مشاهده این کاربر را ندارید.');
  }

  try {
    const { id } = await userGetDetailByIdSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return userGetDetailById(id);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function getAllPaginatedUsersAction(input: unknown = {}) {
  const session = await getSession();

  if (!session) {
    return accessError('برای مشاهده کاربران وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه مشاهده کاربران را ندارید.');
  }

  try {
    const validatedInput = await getAllPaginatedUsersSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return getAllPaginatedUsers(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function getAllUsersAction() {
  const session = await getSession();
  if (!session) return accessError('برای مشاهده کاربران وارد حساب مدیریتی شوید.');
  if (!ALLOWED_ADMIN_ROLES.has(session.role))
    return accessError('شما اجازه مشاهده کاربران را ندارید.');
  return getAllUsers();
}

export async function createUserAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای ایجاد کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه ایجاد کاربر را ندارید.');
  }

  try {
    const validatedInput = await createUserSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return createUser(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function deleteUserByIdAction(input: unknown) {
  const session = await getSession();

  if (!session) {
    return accessError('برای حذف کاربر وارد حساب مدیریتی شوید.');
  }

  if (!ALLOWED_ADMIN_ROLES.has(session.role)) {
    return accessError('شما اجازه حذف این کاربر را ندارید.');
  }

  try {
    const { id } = await deleteUserByIdSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return deleteUserById(id);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

async function updateUserStatusAction(
  input: unknown,
  updateStatus: typeof enableUserById,
  messages: { unauthenticated: string; unauthorized: string },
) {
  const session = await getSession();

  if (!session) return accessError(messages.unauthenticated);
  if (!ALLOWED_ADMIN_ROLES.has(session.role)) return accessError(messages.unauthorized);

  try {
    const { id } = await updateUserStatusByIdSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return updateStatus(id);
  } catch (error: unknown) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function enableUserByIdAction(input: unknown) {
  return updateUserStatusAction(input, enableUserById, {
    unauthenticated: 'برای فعال‌سازی کاربر وارد حساب مدیریتی شوید.',
    unauthorized: 'شما اجازه فعال‌سازی این کاربر را ندارید.',
  });
}

export async function disableUserByIdAction(input: unknown) {
  return updateUserStatusAction(input, disableUserById, {
    unauthenticated: 'برای غیرفعال‌سازی کاربر وارد حساب مدیریتی شوید.',
    unauthorized: 'شما اجازه غیرفعال‌سازی این کاربر را ندارید.',
  });
}

async function validateAuthenticatedInput<T>(
  input: unknown,
  schema: { validate: (value: unknown, options: object) => Promise<T> },
  message: string,
) {
  const session = await getSession();
  if (!session) return { error: accessError(message) } as const;
  try {
    return {
      session,
      value: await schema.validate(input, { abortEarly: false, stripUnknown: true }),
    } as const;
  } catch (error: unknown) {
    if (error instanceof ValidationError)
      return { error: validationErrorToFetcherError(error) } as const;
    throw error;
  }
}

export async function getUserAddressesAction() {
  const session = await getSession();
  return session
    ? getUserAddresses(session.userId)
    : accessError('برای مشاهده نشانی‌ها وارد حساب کاربری شوید.');
}

export async function addUserAddressAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    createUserAddressSchema,
    'برای ثبت نشانی وارد حساب کاربری شوید.',
  );
  return 'error' in result ? result.error : addUserAddress(result.session.userId, result.value);
}

export async function updateUserAddressAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    userAddressIdSchema,
    'برای ویرایش نشانی وارد حساب کاربری شوید.',
  );
  if ('error' in result) return result.error;
  try {
    const value = await updateUserAddressSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return updateUserAddress(result.session.userId, result.value.addressId, value);
  } catch (error: unknown) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function getCartAction() {
  const session = await getSession();
  return session
    ? getCart(session.userId)
    : accessError('برای مشاهده سبد خرید وارد حساب کاربری شوید.');
}

export async function addCartItemAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    addCartItemSchema,
    'برای افزودن به سبد خرید وارد حساب کاربری شوید.',
  );
  return 'error' in result ? result.error : addCartItem(result.session.userId, result.value);
}

export async function deleteCartItemAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    cartEntryIdSchema,
    'برای ویرایش سبد خرید وارد حساب کاربری شوید.',
  );
  return 'error' in result ? result.error : deleteCartItem(result.session.userId, result.value.id);
}

export async function emptyCartAction() {
  const session = await getSession();
  return session
    ? emptyCart(session.userId)
    : accessError('برای ویرایش سبد خرید وارد حساب کاربری شوید.');
}

export async function createDeliveryQuoteAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    createDeliveryQuoteSchema,
    'برای دریافت زمان ارسال وارد حساب کاربری شوید.',
  );
  return 'error' in result
    ? result.error
    : createDeliveryQuote(result.session.userId, result.value);
}

export async function selectDeliveryWindowAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    selectDeliveryWindowSchema,
    'برای انتخاب زمان ارسال وارد حساب کاربری شوید.',
  );
  return 'error' in result
    ? result.error
    : selectDeliveryWindow(result.session.userId, result.value);
}

export async function getWishlistAction() {
  const session = await getSession();
  return session
    ? getWishlist(session.userId)
    : accessError('برای مشاهده علاقه‌مندی‌ها وارد حساب کاربری شوید.');
}

export async function addWishlistItemAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    addWishlistItemSchema,
    'برای افزودن به علاقه‌مندی‌ها وارد حساب کاربری شوید.',
  );
  return 'error' in result ? result.error : addWishlistItem(result.session.userId, result.value);
}

export async function deleteWishlistItemAction(input: unknown) {
  const result = await validateAuthenticatedInput(
    input,
    wishlistEntryIdSchema,
    'برای ویرایش علاقه‌مندی‌ها وارد حساب کاربری شوید.',
  );
  return 'error' in result
    ? result.error
    : deleteWishlistItem(result.session.userId, result.value.id);
}
