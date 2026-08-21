import * as yup from 'yup';

export const otpStepSchema = yup.object({
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, {
      message: 'کد تأیید باید ۶ رقم باشد.',
      excludeEmptyString: true,
    })
    .required('کد تأیید الزامی است.'),
});

export type OtpStepValues = yup.InferType<typeof otpStepSchema>;

export const passwordStepSchema = yup.object({
  newPassword: yup
    .string()
    .required('کلمه عبور جدید الزامی است.')
    .min(8, 'کلمه عبور باید حداقل ۸ نویسه باشد.'),
  confirmPassword: yup
    .string()
    .required('تکرار کلمه عبور الزامی است.')
    .oneOf([yup.ref('newPassword')], 'تکرار کلمه عبور با کلمه عبور جدید یکسان نیست.'),
});

export type PasswordStepValues = yup.InferType<typeof passwordStepSchema>;
