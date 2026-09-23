import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { useAuthStore } from '@/entities/auth/auth.store';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('./_components/profile-orders-wrapper', () => ({
  ProfileOrdersWrapper: () => (
    <section aria-labelledby="orders-heading">
      <h2 id="orders-heading">سفارش‌های من</h2>
    </section>
  ),
}));
vi.mock('./_components/profile-addresses-wrapper', () => ({
  ProfileAddressesWrapper: () => (
    <section aria-labelledby="addresses-heading">
      <h2 id="addresses-heading">نشانی‌های من</h2>
    </section>
  ),
}));

import ProfilePage, { metadata } from './page';

afterEach(cleanup);

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
    birthDate: '1995-09-09T00:00:00.000Z',
  });
});

describe(routePaths.profile, () => {
  it('renders the customer identity and three profile sections', () => {
    render(<ProfilePage />);

    expect(screen.queryByText('حساب کاربری')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'پروفایل من' })).toBeNull();
    expect(
      screen.queryByText('اطلاعات شخصی، سفارش‌ها و نشانی‌های تحویل را از یک‌جا مدیریت کنید.'),
    ).toBeNull();
    expect(screen.queryByText('حساب تأییدشده')).toBeNull();
    expect(screen.queryByText('اطلاعات تماس و مشخصات حساب کاربری خود را ویرایش کنید.')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'نیلوفر احمدی' })).toBeTruthy();
    expect(screen.getByRole('tablist', { name: 'بخش‌های پروفایل' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'سفارش‌ها',
      'نشانی‌ها',
      'اطلاعات شخصی',
    ]);
    expect(screen.getByRole('textbox', { name: 'نام' })).toHaveProperty('value', 'نیلوفر');
    expect(screen.getByRole('spinbutton', { name: 'سن' })).toHaveProperty('value', '31');
    expect(screen.getByRole('button', { name: 'تاریخ تولد' }).getAttribute('data-slot')).toBe(
      'field-control',
    );
  });

  it('switches to the orders tab', () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole('tab', { name: 'سفارش‌ها' }));
    expect(screen.getByRole('heading', { level: 2, name: 'سفارش‌های من' })).toBeTruthy();
  });

  it('switches to the addresses tab', () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole('tab', { name: 'نشانی‌ها' }));
    expect(screen.getByRole('heading', { level: 2, name: 'نشانی‌های من' })).toBeTruthy();
  });

  it('defines profile metadata', () => {
    expect(metadata.title).toBe('حساب کاربری من | پت شاپ پرشین');
  });
});
