import { describe, expect, it } from 'vitest';
import { ValidationError } from 'yup';

import { routePaths } from '@/configs/route.path';
import { USER_ROLES } from '@/configs/user-role';
import { yupMessage, yupMinimumLengthMessage } from '@/configs/yup.config';

import { resolveLoginRedirectPath, validationErrorToFetcherError } from './auth.helpers';
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
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
    ).rejects.toThrow(yupMessage('invalidIranianPhoneNumber'));
  });

  it('rejects passwords shorter than eight characters', async () => {
    await expect(
      registerUserSchema.validate({ phoneNumber: '09123456789', password: '1234567' }),
    ).rejects.toThrow(yupMinimumLengthMessage('password', 8));
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
    ).rejects.toThrow(yupMinimumLengthMessage('password', 6));
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
      yupMessage('invalidIranianPhoneNumber'),
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
      errors: [yupMessage('invalidOtpCode'), yupMessage('resetPasswordRequestRequired')],
    });
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching passwords that satisfy the documented minimum length', async () => {
    const input = { newPassword: '12345678', confirmPassword: '12345678' };

    await expect(resetPasswordSchema.validate(input)).resolves.toEqual(input);
  });

  it('rejects short or mismatched password confirmation', async () => {
    await expect(
      resetPasswordSchema.validate(
        { newPassword: '1234567', confirmPassword: '7654321' },
        { abortEarly: false },
      ),
    ).rejects.toMatchObject({
      errors: [
        yupMinimumLengthMessage('newPassword', 8),
        yupMessage('passwordConfirmationMismatch'),
      ],
    });

    await expect(
      resetPasswordSchema.validate(
        { newPassword: '1234567', confirmPassword: '1234567' },
        { abortEarly: false },
      ),
    ).rejects.toMatchObject({
      errors: [
        yupMinimumLengthMessage('newPassword', 8),
        yupMinimumLengthMessage('confirmPassword', 8),
      ],
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

describe('resolveLoginRedirectPath', () => {
  it('uses a safe internal callback URL before the role fallback', () => {
    expect(resolveLoginRedirectPath('/checkout?step=payment#summary', USER_ROLES.ADMIN)).toBe(
      '/checkout?step=payment#summary',
    );
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'sends the %s role to the admin route when no callback exists',
    (role) => {
      expect(resolveLoginRedirectPath(undefined, role)).toBe(routePaths.admin);
    },
  );

  it('sends customers home when no callback exists', () => {
    expect(resolveLoginRedirectPath(undefined, USER_ROLES.CUSTOMER)).toBe(routePaths.home);
  });

  it.each(['https://evil.example/path', '//evil.example/path', 'javascript:alert(1)'])(
    'rejects the unsafe callback %s',
    (callbackUrl) => {
      expect(resolveLoginRedirectPath(callbackUrl, USER_ROLES.CUSTOMER)).toBe(routePaths.home);
    },
  );
});
