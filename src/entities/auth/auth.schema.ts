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
