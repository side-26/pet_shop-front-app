import * as yup from 'yup';

export type OtpStepValues = {
  verificationCode: string;
};

export type PasswordStepValues = {
  newPassword: string;
  confirmPassword: string;
};

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
