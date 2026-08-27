import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { GetAllPaginatedUsersInput } from '@/entities/users/users.schema';
import { USER_ROLES } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';

import { toSearchParams, UsersAllPaginateFilter } from './users-all-paginate-filter';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('UsersAllPaginateFilter', () => {
  it('normalizes optional filters and resets pagination to the first page', () => {
    expect(
      toSearchParams({
        fullName: 'Ali',
        role: '',
        phoneNumber: '',
        nationalCode: '',
        page: 4,
        limit: 20,
        isEnable: true,
        sort: '',
      }).toString(),
    ).toBe('fullName=Ali&limit=20&isEnable=true&page=1');
  });

  it('submits the documented query filters and closes the dialog', async () => {
    const onOpenChange = vi.fn();
    const initialValues: Partial<GetAllPaginatedUsersInput> = {
      fullName: 'علی',
      role: USER_ROLES.ADMIN,
      page: 3,
      limit: 50,
      isEnable: false,
      sort: 'dsc',
    };

    render(
      <DirectionProvider direction="rtl">
        <UsersAllPaginateFilter open onOpenChange={onOpenChange} initialValues={initialValues} />
      </DirectionProvider>,
    );

    expect(screen.getByLabelText('نام و نام خانوادگی').getAttribute('value')).toBe('علی');
    expect(screen.getByRole('combobox', { name: 'نقش' }).textContent).toContain('مدیر');
    expect(screen.getByRole('combobox', { name: 'مرتب‌سازی' }).textContent).toContain('نزولی');
    expect(
      screen.getByRole('switch', { name: 'فقط کاربران فعال' }).getAttribute('aria-checked'),
    ).toBe('false');

    fireEvent.change(screen.getByLabelText('نام و نام خانوادگی'), { target: { value: 'مریم' } });
    fireEvent.click(screen.getByRole('combobox', { name: 'نقش' }));
    const role = await screen.findByRole('option', { name: 'فروشنده' });
    fireEvent.pointerDown(role, { button: 0 });
    fireEvent.pointerUp(role, { button: 0 });
    fireEvent.click(role);
    fireEvent.click(screen.getByRole('button', { name: 'اعمال فیلتر' }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        routePaths.adminUsersQuery(
          new URLSearchParams(
            'fullName=%D9%85%D8%B1%DB%8C%D9%85&role=seller&limit=50&isEnable=false&sort=dsc&page=1',
          ),
        ),
        {
          scroll: false,
        },
      ),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('restores the active query values when the dialog reopens or they change', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <DirectionProvider direction="rtl">
        <UsersAllPaginateFilter
          open
          onOpenChange={onOpenChange}
          initialValues={{ fullName: 'علی', role: USER_ROLES.ADMIN }}
        />
      </DirectionProvider>,
    );

    fireEvent.change(screen.getByLabelText('نام و نام خانوادگی'), {
      target: { value: 'مقدار ذخیره‌نشده' },
    });

    rerender(
      <DirectionProvider direction="rtl">
        <UsersAllPaginateFilter
          open={false}
          onOpenChange={onOpenChange}
          initialValues={{ fullName: 'علی', role: USER_ROLES.ADMIN }}
        />
      </DirectionProvider>,
    );
    rerender(
      <DirectionProvider direction="rtl">
        <UsersAllPaginateFilter
          open
          onOpenChange={onOpenChange}
          initialValues={{ fullName: 'سارا', role: USER_ROLES.CUSTOMER }}
        />
      </DirectionProvider>,
    );

    expect(screen.getByLabelText('نام و نام خانوادگی').getAttribute('value')).toBe('سارا');
    expect(screen.getByRole('combobox', { name: 'نقش' }).textContent).toContain('مشتری');
  });
});
