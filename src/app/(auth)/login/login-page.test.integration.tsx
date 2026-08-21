import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import LoginPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.login, () => {
  it('renders the complete Persian login form', () => {
    render(
      <DirectionProvider direction="rtl">
        <LoginPage />
      </DirectionProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'ورود به پت‌شاپ' })).toBeTruthy();
    expect(
      screen.getByText(
        'برای بهره مندی از امکانات بیشتر اپلیکیشن شماره تلفن و کلمه عبور خود را وارد کنید',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('form', { name: 'فرم ورود' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'مرا به خاطر بسپار' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'فراموشی کلمه عبور؟' }).getAttribute('href')).toBe(
      routePaths.forgetPassword,
    );
    expect(screen.getByRole('link', { name: 'ثبت‌نام' }).getAttribute('href')).toBe(
      routePaths.register,
    );
    expect(screen.getByRole('button', { name: 'ورود' })).toBeTruthy();
  });

  it('uses medium-touch field sizing and mixed RTL/LTR input direction', () => {
    render(
      <DirectionProvider direction="rtl">
        <LoginPage />
      </DirectionProvider>,
    );

    const phone = screen.getByLabelText('شماره موبایل');
    const password = screen.getByLabelText('کلمه عبور');

    expect(phone.getAttribute('data-size')).toBe('lg');
    expect(phone.getAttribute('dir')).toBe('ltr');
    expect(password.getAttribute('data-size')).toBe('lg');
    expect(password.getAttribute('dir')).toBe('ltr');
  });

  it('shows associated validation messages', async () => {
    render(
      <DirectionProvider direction="rtl">
        <LoginPage />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ورود' }));

    expect(await screen.findByText('شماره موبایل الزامی است.')).toBeTruthy();
    expect(await screen.findByText('کلمه عبور الزامی است.')).toBeTruthy();
  });

  it('defines login metadata', () => {
    expect(metadata.title).toBe('ورود');
  });
});
