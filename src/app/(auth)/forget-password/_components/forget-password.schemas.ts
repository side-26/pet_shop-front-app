import * as yup from 'yup';

export type PhoneStepValues = {
  phoneNumber: string;
};

export type OtpStepValues = {
  verificationCode: string;
};

export type PasswordStepValues = {
  newPassword: string;
  confirmPassword: string;
};

export const phoneStepSchema: yup.ObjectSchema<PhoneStepValues> = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^09\d{9}$/, {
      message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
      excludeEmptyString: true,
    })
    .required('شماره موبایل الزامی است.'),
});

export const otpStepSchema: yup.ObjectSchema<OtpStepValues> = yup.object({
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, {
      message: 'کد تأیید باید ۶ رقم باشد.',
      excludeEmptyString: true,
    })
    .required('کد تأیید الزامی است.'),
});

export const passwordStepSchema: yup.ObjectSchema<PasswordStepValues> = yup.object({
  newPassword: yup
    .string()
    .required('کلمه عبور جدید الزامی است.')
    .min(8, 'کلمه عبور باید حداقل ۸ نویسه باشد.'),
  confirmPassword: yup
    .string()
    .required('تکرار کلمه عبور الزامی است.')
    .oneOf([yup.ref('newPassword')], 'تکرار کلمه عبور با کلمه عبور جدید یکسان نیست.'),
});
