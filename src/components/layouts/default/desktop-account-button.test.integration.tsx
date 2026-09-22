import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { useAuthStore } from '@/entities/auth/auth.store';

import { DesktopAccountButton } from './desktop-account-button';

afterEach(cleanup);

beforeEach(() => {
  useAuthStore.getState().deleteUserIdentity();
});

describe('DesktopAccountButton', () => {
  it('links visitors to the login page', () => {
    render(<DesktopAccountButton />);

    expect(screen.getByRole('link', { name: 'حساب کاربری' }).getAttribute('href')).toBe(
      routePaths.login,
    );
  });

  it('renders the account-menu trigger when the identity store has a user', () => {
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

    render(<DesktopAccountButton />);

    expect(screen.getByRole('button', { name: 'حساب کاربری' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'حساب کاربری' })).toBeNull();
  });
});
