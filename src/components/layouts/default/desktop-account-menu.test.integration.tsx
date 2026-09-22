import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { DesktopAccountMenu } from './desktop-account-menu';

const logoutUserMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/auth/auth.client', () => ({ logoutUser: logoutUserMock }));

const user = {
  userId: 'user-1',
  firstName: 'نیلوفر',
  lastName: 'احمدی',
  phoneNumber: '09121234567',
  role: 'customer',
  avatar: '',
  email: 'niloofar@example.com',
  nationalCode: '0012345678',
  age: 31,
  birthDate: null,
} as const;

afterEach(cleanup);

describe('DesktopAccountMenu', () => {
  it('opens on click with the identity, profile, disabled orders, and logout actions', async () => {
    render(<DesktopAccountMenu user={user} />);

    fireEvent.click(screen.getByRole('button', { name: 'حساب کاربری' }));

    expect(await screen.findByText('نیلوفر احمدی')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'پروفایل' }).getAttribute('href')).toBe(
      routePaths.profile,
    );
    expect(
      screen.getByRole('menuitem', { name: 'سفارش‌ها' }).getAttribute('data-disabled'),
    ).not.toBe(null);

    fireEvent.click(screen.getByRole('menuitem', { name: 'خروج' }));
    expect(logoutUserMock).toHaveBeenCalledOnce();
  });

  it('closes when the user clicks outside the dropdown', async () => {
    render(<DesktopAccountMenu user={user} />);

    fireEvent.click(screen.getByRole('button', { name: 'حساب کاربری' }));
    await screen.findByRole('menuitem', { name: 'پروفایل' });
    fireEvent.pointerDown(document.body);

    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'پروفایل' })).toBeNull());
  });

  it('uses the phone number when the user has no full name', async () => {
    render(<DesktopAccountMenu user={{ ...user, firstName: '', lastName: '' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'حساب کاربری' }));

    expect(await screen.findByText(user.phoneNumber)).toBeTruthy();
  });
});
