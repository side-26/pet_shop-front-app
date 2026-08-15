import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import LoginPage, { metadata } from './page';

afterEach(cleanup);

describe('/login', () => {
  it('renders the complete Persian login form', () => {
    render(
      <DirectionProvider direction="rtl">
        <LoginPage />
      </DirectionProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'ورود به پت‌شاپ' })).toBeTruthy();
    expect(screen.getByRole('form', { name: 'فرم ورود' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'مرا به خاطر بسپار' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'فراموشی رمز عبور؟' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'ثبت‌نام' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ورود' })).toBeTruthy();
  });

  it('uses medium-touch field sizing and mixed RTL/LTR input direction', () => {
    render(
      <DirectionProvider direction="rtl">
        <LoginPage />
      </DirectionProvider>,
    );

    const phone = screen.getByLabelText('شماره موبایل');
    const password = screen.getByLabelText('رمز عبور');

    expect(phone.getAttribute('data-size')).toBe('lg');
    expect(phone.getAttribute('dir')).toBe('ltr');
    expect(phone.className).toContain('[&::placeholder]:[direction:rtl]');
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
    expect(await screen.findByText('رمز عبور الزامی است.')).toBeTruthy();
  });

  it('defines login metadata', () => {
    expect(metadata.title).toBe('ورود');
  });
});
