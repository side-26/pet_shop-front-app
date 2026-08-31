import { boolean, object, ref, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';

export const iranianPhoneNumberSchema = string()
  .matches(/^09\d{9}$/, {
    message: yupMessage('invalidIranianPhoneNumber'),
    excludeEmptyString: true,
  })
  .required();

export const registerUserSchema = object({
  phoneNumber: iranianPhoneNumberSchema,
  password: string().required().min(8),
});

export type RegisterUserInput = InferType<typeof registerUserSchema>;

export const loginUserSchema = object({
  phoneNumber: iranianPhoneNumberSchema,
  password: string().required().min(6),
  rememberMe: boolean().required(),
});

export type LoginUserInput = InferType<typeof loginUserSchema>;

export const sendOtpSchema = object({
  phoneNumber: iranianPhoneNumberSchema,
});

export type SendOtpInput = InferType<typeof sendOtpSchema>;

export const otpCodeSchema = string()
  .matches(/^\d{6}$/, {
    message: yupMessage('invalidOtpCode'),
    excludeEmptyString: true,
  })
  .required();

export const verifyOtpCodeSchema = object({
  verificationCode: otpCodeSchema,
});

export type VerifyOtpCodeInput = InferType<typeof verifyOtpCodeSchema>;

export const verifyResetPasswordOtpSchema = object({
  phoneNumber: iranianPhoneNumberSchema,
  'otp-code': otpCodeSchema,
  'reset-password': boolean().oneOf([true], yupMessage('resetPasswordRequestRequired')).required(),
});

export type VerifyResetPasswordOtpInput = InferType<typeof verifyResetPasswordOtpSchema>;

export const resetPasswordSchema = object({
  newPassword: string().required().min(8),
  confirmPassword: string()
    .required()
    .min(8)
    .oneOf([ref('newPassword')], yupMessage('passwordConfirmationMismatch')),
});

export type ResetPasswordInput = InferType<typeof resetPasswordSchema>;
