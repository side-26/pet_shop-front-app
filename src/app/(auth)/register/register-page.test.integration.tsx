import { DirectionProvider } from '@base-ui/react/direction-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import RegisterPage, { metadata } from './page';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ replace: vi.fn() }) }));

afterEach(cleanup);

function renderPage() {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
    >
      <DirectionProvider direction="rtl">
        <RegisterPage />
      </DirectionProvider>
    </QueryClientProvider>,
  );
}

describe(routePaths.register, () => {
  it('renders the Persian registration form without login-only actions', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'ثبت‌نام در پت‌شاپ' })).toBeTruthy();
    expect(
      screen.getByText('برای ساخت حساب کاربری شماره تلفن و کلمه عبور خود را وارد کنید'),
    ).toBeTruthy();
    expect(screen.getByRole('form', { name: 'فرم ثبت‌نام' })).toBeTruthy();
    expect(screen.queryByRole('checkbox', { name: 'مرا به خاطر بسپار' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'فراموشی کلمه عبور؟' })).toBeNull();
    expect(screen.getByRole('link', { name: 'ورود' }).getAttribute('href')).toBe(routePaths.login);
    expect(screen.getByRole('button', { name: 'ثبت‌نام' })).toBeTruthy();
  });

  it('uses the same field sizing and direction as the login form', () => {
    renderPage();

    const phone = screen.getByLabelText('شماره موبایل');
    const password = screen.getByLabelText('کلمه عبور');

    expect(phone.getAttribute('data-size')).toBe('lg');
    expect(phone.getAttribute('dir')).toBe('ltr');
    expect(password.getAttribute('data-size')).toBe('lg');
    expect(password.getAttribute('dir')).toBe('ltr');
    expect(password.getAttribute('autocomplete')).toBe('new-password');
  });

  it('shows associated validation messages', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'ثبت‌نام' }));

    expect(await screen.findByText('شماره موبایل الزامی است.')).toBeTruthy();
    expect(await screen.findByText('کلمه عبور الزامی است.')).toBeTruthy();
  });

  it('defines registration metadata', () => {
    expect(metadata.title).toBe('ثبت‌نام');
  });
});
