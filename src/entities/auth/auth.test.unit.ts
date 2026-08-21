import { describe, expect, it } from 'vitest';
import { ValidationError } from 'yup';

import { validationErrorToFetcherError } from './auth.helpers';
import {
  loginUserSchema,
  registerUserSchema,
  sendOtpSchema,
  verifyResetPasswordOtpSchema,
} from './auth.schema';

describe('registerUserSchema', () => {
  it('accepts an Iranian mobile number and a password with at least eight characters', async () => {
    await expect(
      registerUserSchema.validate({ phoneNumber: '09123456789', password: '12345678' }),
    ).resolves.toEqual({ phoneNumber: '09123456789', password: '12345678' });
  });

  it('rejects non-Iranian mobile numbers', async () => {
    await expect(
      registerUserSchema.validate({ phoneNumber: '08123456789', password: '12345678' }),
    ).rejects.toThrow('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.');
  });

  it('rejects passwords shorter than eight characters', async () => {
    await expect(
      registerUserSchema.validate({ phoneNumber: '09123456789', password: '1234567' }),
    ).rejects.toThrow('کلمه عبور باید حداقل ۸ نویسه باشد.');
  });
});

describe('loginUserSchema', () => {
  it('accepts valid login form values', async () => {
    await expect(
      loginUserSchema.validate({
        phoneNumber: '09123456789',
        password: '123456',
        rememberMe: false,
      }),
    ).resolves.toEqual({
      phoneNumber: '09123456789',
      password: '123456',
      rememberMe: false,
    });
  });

  it('rejects a short login password', async () => {
    await expect(
      loginUserSchema.validate({
        phoneNumber: '09123456789',
        password: '12345',
        rememberMe: false,
      }),
    ).rejects.toThrow('کلمه عبور باید حداقل ۶ نویسه باشد.');
  });
});

describe('sendOtpSchema', () => {
  it('accepts an Iranian mobile number', async () => {
    await expect(sendOtpSchema.validate({ phoneNumber: '09123456789' })).resolves.toEqual({
      phoneNumber: '09123456789',
    });
  });

  it('rejects an invalid mobile number', async () => {
    await expect(sendOtpSchema.validate({ phoneNumber: '123' })).rejects.toThrow(
      'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
    );
  });
});

describe('verifyResetPasswordOtpSchema', () => {
  it('accepts the documented wire fields for password recovery', async () => {
    const input = {
      phoneNumber: '09123456789',
      'otp-code': '123456',
      'reset-password': true,
    } as const;

    await expect(verifyResetPasswordOtpSchema.validate(input)).resolves.toEqual(input);
  });

  it('rejects invalid OTP values and non-reset verification requests', async () => {
    await expect(
      verifyResetPasswordOtpSchema.validate(
        {
          phoneNumber: '09123456789',
          'otp-code': '12345',
          'reset-password': false,
        },
        { abortEarly: false },
      ),
    ).rejects.toMatchObject({
      errors: ['کد تأیید باید ۶ رقم باشد.', 'درخواست تأیید باید برای بازیابی کلمه عبور باشد.'],
    });
  });
});

describe('validationErrorToFetcherError', () => {
  it('normalizes validation failures for the global error handler', () => {
    const error = new ValidationError('Invalid phone', undefined, 'phoneNumber');

    expect(validationErrorToFetcherError(error)).toEqual({
      isSuccess: false,
      message: null,
      data: {
        messages: [{ value: 'phoneNumber', label: 'Invalid phone' }],
        details: {},
      },
    });
  });
});
