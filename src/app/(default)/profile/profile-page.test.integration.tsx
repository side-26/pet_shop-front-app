import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import ProfilePage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.profile, () => {
  it('renders the customer identity and three profile sections', () => {
    render(<ProfilePage />);

    expect(screen.queryByText('حساب کاربری')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'پروفایل من' })).toBeNull();
    expect(
      screen.queryByText('اطلاعات شخصی، سفارش‌ها و نشانی‌های تحویل را از یک‌جا مدیریت کنید.'),
    ).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'نیلوفر احمدی' })).toBeTruthy();
    expect(screen.getByRole('tablist', { name: 'بخش‌های پروفایل' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('textbox', { name: 'نام' })).toHaveProperty('value', 'نیلوفر');
  });

  it('switches to orders and opens an accessible order detail dialog', () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole('tab', { name: 'سفارش‌ها' }));
    expect(screen.getByRole('heading', { level: 2, name: 'سفارش‌های من' })).toBeTruthy();
    expect(screen.getAllByText('PH-1405-2841').length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: 'جزئیات سفارش' })[0]);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'جزئیات سفارش' })).toBeTruthy();
    expect(screen.getByText('غذای خشک گربه رویال کنین')).toBeTruthy();
  });

  it('shows responsive address cards and the add-address form', () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole('tab', { name: 'نشانی‌ها' }));
    expect(screen.getByRole('heading', { level: 2, name: 'نشانی‌های من' })).toBeTruthy();
    expect(screen.getByText('نشانی پیش‌فرض')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'افزودن نشانی' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'افزودن نشانی جدید' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'عنوان نشانی' })).toBeTruthy();
  });

  it('defines profile metadata', () => {
    expect(metadata.title).toBe('حساب کاربری من | پناهگاه پرشین');
  });
});
