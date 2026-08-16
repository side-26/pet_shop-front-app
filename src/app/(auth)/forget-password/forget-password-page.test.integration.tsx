import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OtpStepForm } from '@/app/(auth)/forget-password/_components/otp-step-form';
import { routePaths } from '@/configs/route.path';

import ForgetPasswordPage, { metadata } from './page';

beforeEach(() => {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: vi.fn(() => null),
  });
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function renderPage() {
  return render(
    <DirectionProvider direction="rtl">
      <ForgetPasswordPage />
    </DirectionProvider>,
  );
}

async function goToOtpStep(phoneNumber = '09123456789') {
  fireEvent.change(screen.getByLabelText('شماره موبایل'), {
    target: { value: phoneNumber },
  });
  fireEvent.click(screen.getByRole('button', { name: 'ارسال کد تأیید' }));

  await screen.findByText(phoneNumber);
}

describe(routePaths.forgetPassword, () => {
  it('starts with the centered phone-number form and route metadata', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'فراموشی کلمه عبور' })).toBeTruthy();
    expect(
      screen.getByText('شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.'),
    ).toBeTruthy();
    expect(screen.getByRole('form', { name: 'فرم شماره موبایل بازیابی کلمه عبور' })).toBeTruthy();
    expect(screen.getByLabelText('شماره موبایل').getAttribute('data-size')).toBe('lg');
    expect(screen.getByText('مرحله 1 از ۳')).toBeTruthy();
    expect(metadata.title).toBe('فراموشی کلمه عبور');
  });

  it('moves through OTP auto-submission and validates the new password fields', async () => {
    renderPage();
    await goToOtpStep();

    expect(screen.getByRole('button', { name: 'تغییر شماره' })).toBeTruthy();
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 01:00');

    const otpInput = screen.getByLabelText('کد تأیید');
    expect(
      otpInput.closest('[data-slot="form"]')?.querySelectorAll('[data-slot="input-otp-slot"]'),
    ).toHaveLength(6);
    expect(
      otpInput
        .closest('[data-slot="form"]')
        ?.querySelector('[data-slot="input-otp-group"]')
        ?.getAttribute('data-size'),
    ).toBe('md');
    expect(screen.queryByRole('button', { name: /تأیید|ادامه/ })).toBeNull();

    fireEvent.change(otpInput, { target: { value: '123456' } });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'تنظیم کلمه عبور جدید' }),
    ).toBeTruthy();
    expect(screen.getByLabelText('کلمه عبور جدید').getAttribute('autocomplete')).toBe(
      'new-password',
    );
    expect(screen.getByLabelText('تکرار کلمه عبور جدید')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('کلمه عبور جدید'), {
      target: { value: '1234567' },
    });
    fireEvent.change(screen.getByLabelText('تکرار کلمه عبور جدید'), {
      target: { value: '7654321' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'بازنشانی کلمه عبور' }));

    expect(await screen.findByText('کلمه عبور باید حداقل ۸ نویسه باشد.')).toBeTruthy();
    expect(await screen.findByText('تکرار کلمه عبور با کلمه عبور جدید یکسان نیست.')).toBeTruthy();
  });

  it('returns to the phone step without losing the entered number', async () => {
    renderPage();
    await goToOtpStep();

    fireEvent.click(screen.getByRole('button', { name: 'تغییر شماره' }));

    await waitFor(() =>
      expect((screen.getByLabelText('شماره موبایل') as HTMLInputElement).value).toBe('09123456789'),
    );
  });

  it('replaces an expired countdown with resend and restarts it on click', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-16T00:00:00Z'));

    render(
      <DirectionProvider direction="rtl">
        <OtpStepForm resendSeconds={1} onSubmit={vi.fn()} />
      </DirectionProvider>,
    );

    act(() => vi.advanceTimersByTime(1000));

    const resendButton = screen.getByRole('button', { name: 'ارسال مجدد کد' });
    expect(screen.getByRole('timer').getAttribute('data-state')).toBe('expired');

    fireEvent.click(resendButton);

    expect(screen.queryByRole('button', { name: 'ارسال مجدد کد' })).toBeNull();
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:01');
  });
});
