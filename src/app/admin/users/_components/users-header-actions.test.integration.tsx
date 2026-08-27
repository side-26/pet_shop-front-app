import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { USER_ROLES } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';

import { UsersHeaderActions } from './users-header-actions';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh }) }));

afterEach(() => {
  cleanup();
  refresh.mockClear();
});

describe('UsersHeaderActions', () => {
  it('registers add, filter, and reload actions in their requested display order', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.adminUsers}>
          <UsersHeaderActions
            initialValues={{
              fullName: 'مریم',
              role: USER_ROLES.SELLER,
              isEnable: false,
              sort: 'dsc',
            }}
          />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    expect(await screen.findByRole('button', { name: 'افزودن کاربر' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Reload' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'More header actions' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Reload' }));
    expect(refresh).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(await screen.findByRole('dialog', { name: 'فیلتر کاربران' })).toBeTruthy();
    expect(screen.getByLabelText('نام و نام خانوادگی').getAttribute('value')).toBe('مریم');
    expect(screen.getByRole('combobox', { name: 'نقش' }).textContent).toContain('فروشنده');
    expect(screen.getByRole('combobox', { name: 'مرتب‌سازی' }).textContent).toContain('نزولی');
    expect(
      screen.getByRole('switch', { name: 'فقط کاربران فعال' }).getAttribute('aria-checked'),
    ).toBe('false');
  });
});
