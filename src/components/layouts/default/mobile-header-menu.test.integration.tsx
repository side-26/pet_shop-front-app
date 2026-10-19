import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { useAuthStore } from '@/entities/auth/auth.store';
import { useCommonStore } from '@/stores/common.store';

import { MobileHeaderMenu } from './mobile-header-menu';

const logoutUser = vi.hoisted(() => vi.fn());

vi.mock('@/entities/auth/auth.client', () => ({ useLogoutUser: () => logoutUser }));

beforeEach(() => {
  useAuthStore.getState().saveUserIdentity({
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
  });
});

afterEach(() => {
  cleanup();
  act(() => {
    useAuthStore.getState().deleteUserIdentity();
    useCommonStore.getState().hideConfirmDialog();
  });
  logoutUser.mockReset();
});

describe('MobileHeaderMenu', () => {
  it('confirms logout from the overflow navigation menu', async () => {
    render(
      <>
        <MobileHeaderMenu />
        <ConfirmDialog />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منوی بیشتر' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'خروج از حساب' }));

    expect(await screen.findByRole('alertdialog', { name: 'از حساب خارج می‌شوید؟' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));

    await waitFor(() => expect(logoutUser).toHaveBeenCalledOnce());
  });
});
