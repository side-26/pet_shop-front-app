import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { toast } from '@/components/ui/toast';
import { deleteUserByIdAction, userGetDetailByIdAction } from '@/entities/users/users.actions';
import type { UserDetailDTO } from '@/entities/users/users.dto';
import { globalErrorHandler } from '@/utils/helpers';
import { useCommonStore } from '@/stores/common.store';

import { UserInfoRenderer } from './user-info-dialog';
import { UsersRowActions } from './users-row-actions';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/entities/users/users.actions', () => ({
  deleteUserByIdAction: vi.fn(),
  userGetDetailByIdAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const deleteUserByIdActionMock = vi.mocked(deleteUserByIdAction);
const userGetDetailByIdActionMock = vi.mocked(userGetDetailByIdAction);
const globalErrorHandlerMock = vi.mocked(globalErrorHandler);
const toastAddMock = vi.mocked(toast.add);

const user: UserDetailDTO = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'مریم',
  lastName: 'احمدی',
  phoneNumber: '09121234567',
  email: 'maryam@example.com',
  isEnable: true,
  avatar: '',
  nationalCode: '0012345678',
  addresses: [
    {
      province: 'تهران',
      city: 'تهران',
      detailAddress: 'خیابان ولیعصر',
      plate: '۱۲',
      unit: '۳',
      postalCode: '1234567890',
      receiverIsMe: true,
      firstName: 'مریم',
      lastName: 'احمدی',
      nationalCode: '0012345678',
      phoneNumber: '09121234567',
    },
  ],
  age: 32,
  role: USER_ROLES.ADMIN,
  orders: [{ _id: 'order-1' }],
  cart: {
    totalPrice: 0,
    items: [{ item: {}, itemType: 'product', quantity: 1 }],
    discountPrice: 0,
    userAddress: null,
    deliveringDateToShipping: null,
    shippingPrice: 0,
    shippingInfo: { name: '', trackingCode: '', estimateDeliveryDate: null },
    paymentType: 0,
    instalmentCompany: null,
  },
  wishlist: [{ _id: 'wish-1' }],
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-29T00:00:00.000Z',
};

function renderRtl(node: React.ReactNode) {
  return render(<DirectionProvider direction="rtl">{node}</DirectionProvider>);
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  useCommonStore.getState().hideConfirmDialog();
});

describe('UserInfoDialog', () => {
  it('reuses the user renderer for loading and then shows the complete result', () => {
    const { container, rerender } = renderRtl(<UserInfoRenderer isSkeleton />);
    expect(container.querySelector('[aria-busy="true"]')?.className).toContain('skeleton');

    rerender(
      <DirectionProvider direction="rtl">
        <UserInfoRenderer user={user} />
      </DirectionProvider>,
    );

    expect(screen.getByText('maryam@example.com')).toBeTruthy();
    expect(screen.getByText('خیابان ولیعصر', { exact: false })).toBeTruthy();
    expect(screen.getByText('مدیر')).toBeTruthy();
    expect(screen.getByText('فعال')).toBeTruthy();
    expect(screen.queryByLabelText('رمز عبور')).toBeNull();
  });

  it('renders a normalized action error', () => {
    renderRtl(<UserInfoRenderer errorMessage="کاربر پیدا نشد." />);
    expect(screen.getByRole('alert').textContent).toContain('کاربر پیدا نشد.');
  });
});

describe('UsersRowActions', () => {
  it('starts the detail request only after selection and lazy-loads the dialog', async () => {
    userGetDetailByIdActionMock.mockResolvedValue({ isSuccess: true, message: null, data: user });
    renderRtl(<UsersRowActions userId={user._id} userName="مریم احمدی" />);

    expect(userGetDetailByIdActionMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'عملیات مریم احمدی' }));
    fireEvent.click(await screen.findByText('مشاهده اطلاعات کاربر'));

    expect(userGetDetailByIdActionMock).toHaveBeenCalledWith({ id: user._id });
    expect(await screen.findByRole('dialog', { name: 'اطلاعات کاربر' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'بستن گفتگو' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'اطلاعات کاربر' })).toBeNull());
  });

  it('confirms deletion before calling the action, then reports success and refreshes the table', async () => {
    deleteUserByIdActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'کاربر حذف شد.',
      data: undefined,
    });
    renderRtl(
      <>
        <UsersRowActions userId={user._id} userName="مریم احمدی" />
        <ConfirmDialog />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات مریم احمدی' }));
    fireEvent.click(await screen.findByText('حذف کاربر'));

    expect(await screen.findByRole('alertdialog', { name: 'کاربر حذف شود؟' })).toBeTruthy();
    expect(deleteUserByIdActionMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));

    await waitFor(() => expect(deleteUserByIdActionMock).toHaveBeenCalledWith({ id: user._id }));
    expect(toastAddMock).toHaveBeenCalledWith({ type: 'success', title: 'کاربر حذف شد.' });
    expect(refresh).toHaveBeenCalledOnce();
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('shows a normalized delete error without refreshing the table', async () => {
    const error = {
      isSuccess: false as const,
      message: 'حذف کاربر ناموفق بود.',
      data: { messages: {}, details: {} },
    };
    deleteUserByIdActionMock.mockResolvedValue(error);
    renderRtl(
      <>
        <UsersRowActions userId={user._id} userName="مریم احمدی" />
        <ConfirmDialog />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات مریم احمدی' }));
    fireEvent.click(await screen.findByText('حذف کاربر'));
    fireEvent.click(await screen.findByRole('button', { name: 'تأیید' }));

    await waitFor(() => expect(globalErrorHandlerMock).toHaveBeenCalledWith(error));
    expect(refresh).not.toHaveBeenCalled();
    expect(toastAddMock).not.toHaveBeenCalled();
  });
});
