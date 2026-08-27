import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';

import { UsersPaginateTable } from './_components/users-paginate-table';
import { usersTableSkeletonData } from './_components/users-table.mock';
import { UsersTableContainer } from './_components/users-table-container';
import type { UserTableRow } from './_components/users-table.types';

const users: UserTableRow[] = [
  {
    id: 'admin-1',
    fullName: 'مریم احمدی',
    phoneNumber: '09121234567',
    nationalCode: '0012345678',
    role: USER_ROLES.ADMIN,
    isEnable: true,
  },
  {
    id: 'seller-1',
    fullName: 'علی رضایی',
    phoneNumber: '09192345678',
    nationalCode: '0456789123',
    role: USER_ROLES.SELLER,
    isEnable: true,
  },
  {
    id: 'customer-1',
    fullName: 'سارا کریمی',
    phoneNumber: '09351234567',
    nationalCode: '1287654321',
    role: USER_ROLES.CUSTOMER,
    isEnable: false,
  },
];

function renderTable(props?: Partial<React.ComponentProps<typeof UsersPaginateTable>>) {
  return render(
    <DirectionProvider direction="rtl">
      <UsersPaginateTable users={users} page={2} pageCount={4} total={20} {...props} />
    </DirectionProvider>,
  );
}

afterEach(cleanup);

describe(routePaths.adminUsers, () => {
  it('renders all requested user columns and semantic states', () => {
    renderTable();

    for (const heading of [
      'تصویر',
      'نام و نام خانوادگی',
      'شماره موبایل',
      'کد ملی',
      'نقش',
      'وضعیت',
    ]) {
      expect(screen.getByRole('columnheader', { name: heading })).toBeTruthy();
    }

    expect(screen.getByText('مدیر')).toBeTruthy();
    expect(screen.getByText('فروشنده')).toBeTruthy();
    expect(screen.getByText('مشتری')).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'مریم احمدی: فعال' })).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'سارا کریمی: غیرفعال' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'عملیات مریم احمدی' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'رفتن به صفحه قبلی' }).getAttribute('href')).toBe(
      routePaths.adminUsersPage(1),
    );
  });

  it('reuses mock rows for a busy, non-interactive skeleton table', () => {
    renderTable({
      users: usersTableSkeletonData,
      page: 1,
      pageCount: 1,
      total: usersTableSkeletonData.length,
      isLoading: true,
    });

    const region = screen.getByRole('region', { name: 'فهرست کاربران' });
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

  it('handles empty and normalized error results outside the table renderer', async () => {
    const empty = await UsersTableContainer({
      usersPromise: Promise.resolve({
        isSuccess: true,
        data: { users: [], page: 1, pageCount: 1, total: 0 },
      }),
    });
    const error = await UsersTableContainer({
      usersPromise: Promise.resolve({ isSuccess: false, message: 'خطا در ارتباط با سرور' }),
    });

    const { rerender } = render(empty);
    expect(screen.getByText('کاربری پیدا نشد')).toBeTruthy();
    rerender(error);
    expect(screen.getByText('دریافت کاربران انجام نشد')).toBeTruthy();
    expect(screen.getByText('خطا در ارتباط با سرور')).toBeTruthy();
  });
});
