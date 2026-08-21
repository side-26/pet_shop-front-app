import * as yup from 'yup';

export const iranianPhoneNumberSchema = yup
  .string()
  .matches(/^09\d{9}$/, {
    message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
    excludeEmptyString: true,
  })
  .required('شماره موبایل الزامی است.');

export const registerUserSchema = yup.object({
  phoneNumber: iranianPhoneNumberSchema,
  password: yup
    .string()
    .required('کلمه عبور الزامی است.')
    .min(8, 'کلمه عبور باید حداقل ۸ نویسه باشد.'),
});

export type RegisterUserInput = yup.InferType<typeof registerUserSchema>;

export const loginUserSchema = yup.object({
  phoneNumber: iranianPhoneNumberSchema,
  password: yup
    .string()
    .required('کلمه عبور الزامی است.')
    .min(6, 'کلمه عبور باید حداقل ۶ نویسه باشد.'),
  rememberMe: yup.boolean().required(),
});

export type LoginUserInput = yup.InferType<typeof loginUserSchema>;

export const sendOtpSchema = yup.object({
  phoneNumber: iranianPhoneNumberSchema,
});

export type SendOtpInput = yup.InferType<typeof sendOtpSchema>;

export const otpCodeSchema = yup
  .string()
  .matches(/^\d{6}$/, {
    message: 'کد تأیید باید ۶ رقم باشد.',
    excludeEmptyString: true,
  })
  .required('کد تأیید الزامی است.');

export const verifyOtpCodeSchema = yup.object({
  verificationCode: otpCodeSchema,
});

export type VerifyOtpCodeInput = yup.InferType<typeof verifyOtpCodeSchema>;

export const verifyResetPasswordOtpSchema = yup.object({
  phoneNumber: iranianPhoneNumberSchema,
  'otp-code': otpCodeSchema,
  'reset-password': yup
    .boolean()
    .oneOf([true], 'درخواست تأیید باید برای بازیابی کلمه عبور باشد.')
    .required(),
});

export type VerifyResetPasswordOtpInput = yup.InferType<typeof verifyResetPasswordOtpSchema>;

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required('کلمه عبور جدید الزامی است.')
    .min(8, 'کلمه عبور باید حداقل ۸ نویسه باشد.'),
  confirmPassword: yup
    .string()
    .required('تکرار کلمه عبور الزامی است.')
    .min(8, 'تکرار کلمه عبور باید حداقل ۸ نویسه باشد.')
    .oneOf([yup.ref('newPassword')], 'تکرار کلمه عبور با کلمه عبور جدید یکسان نیست.'),
});

export type ResetPasswordInput = yup.InferType<typeof resetPasswordSchema>;
