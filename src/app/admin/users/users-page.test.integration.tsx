import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';

import { UsersPaginateTable } from './_components/users-paginate-table';
import { usersTableSkeletonData } from './_components/users-table-skeleton-data';
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
    expect(
      screen.getByRole('switch', { name: 'مریم احمدی: فعال' }).getAttribute('data-checked-color'),
    ).toBe('success');
    expect(
      screen
        .getByRole('switch', { name: 'سارا کریمی: غیرفعال' })
        .getAttribute('data-unchecked-color'),
    ).toBe('error');
    expect(screen.getByRole('button', { name: 'عملیات مریم احمدی' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'رفتن به صفحه قبلی' }).getAttribute('href')).toBe(
      routePaths.adminUsersPage(1),
    );
  });

  it('reuses mock rows for a busy, non-interactive skeleton table', () => {
    const { container } = renderTable({
      users: usersTableSkeletonData,
      page: 1,
      pageCount: 1,
      total: usersTableSkeletonData.length,
      isLoading: true,
    });

    const region = container.querySelector('section')!;
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

  it('handles empty and normalized error results', async () => {
    const empty = await UsersTableContainer({
      usersPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: {
          result: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 20,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
          },
        },
      }),
    });
    const error = await UsersTableContainer({
      usersPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطا در ارتباط با سرور',
        data: { messages: {}, details: {} },
      }),
    });

    const { rerender } = render(empty);
    expect(screen.getByRole('cell', { name: '_' })).toBeTruthy();
    rerender(error);
    expect(screen.getByText('دریافت کاربران انجام نشد')).toBeTruthy();
    expect(screen.getByText('خطا در ارتباط با سرور')).toBeTruthy();
  });

  it('uses an underscore for empty user values and reserves footer space for the item count', () => {
    renderTable({
      users: [
        {
          ...users[0],
          fullName: '',
          phoneNumber: '',
          nationalCode: '',
        },
      ],
    });

    expect(screen.getAllByText('_')).toHaveLength(4);
    expect(screen.getByText('نمایش 1 کاربر از 20').className).toContain('tw:flex-none');
    expect(screen.getByText('نمایش 1 کاربر از 20').className).toContain('tw:text-label-s');
  });

  it('gives the table and pagination wrapper the required main-content height', () => {
    const { container } = renderTable();

    const region = container.querySelector('section')!;
    expect(region.getAttribute('aria-label')).toBeNull();
    expect(region.className).toContain('tw:h-10');
    expect(region.className).toContain('tw:flex-auto');
    expect(region.className).not.toContain('tw:flex-1');
  });

  it('maps the real paginated users response into the shared table renderer', async () => {
    const loaded = await UsersTableContainer({
      usersPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: {
          result: [
            {
              _id: 'real-user-1',
              firstName: 'مریم',
              lastName: 'احمدی',
              nationalCode: '0012345678',
              cart: [],
              isEnable: true,
              phoneNumber: '09121234567',
              email: 'maryam@example.com',
              role: USER_ROLES.ADMIN,
              orders: [],
              wishlist: [],
              age: 32,
              addresses: [],
            },
          ],
          pagination: {
            currentPage: 2,
            totalPages: 4,
            totalItems: 61,
            itemsPerPage: 20,
            hasNextPage: true,
            hasPrevPage: true,
            nextPage: 3,
            prevPage: 1,
          },
        },
      }),
    });

    render(<DirectionProvider direction="rtl">{loaded}</DirectionProvider>);

    expect(screen.getByText('مریم احمدی')).toBeTruthy();
    expect(screen.getByText('نمایش 1 کاربر از 61')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'رفتن به صفحه قبلی' }).getAttribute('href')).toBe(
      routePaths.adminUsersPage(1),
    );
  });
});
