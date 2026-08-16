'use client';

import { LockKeyholeIcon, PhoneIcon } from 'lucide-react';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

type RegisterValues = {
  phoneNumber: string;
  password: string;
};

const registerSchema: yup.ObjectSchema<RegisterValues> = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^09\d{9}$/, {
      message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
      excludeEmptyString: true,
    })
    .required('شماره موبایل الزامی است.'),
  password: yup
    .string()
    .required('رمز عبور الزامی است.')
    .min(6, 'رمز عبور باید حداقل ۶ نویسه باشد.'),
});

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function RegisterForm() {
  return (
    <Form<RegisterValues>
      validationSchema={registerSchema}
      options={{
        defaultValues: { phoneNumber: '', password: '' },
        mode: 'onBlur',
      }}
      handleSubmit={() => undefined}
      aria-label="فرم ثبت‌نام"
      className="tw:gap-3 tw:[&_[data-slot=field]>span:last-child:has(>span:empty)]:hidden tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:[&_[data-slot=field-label]]:sr-only"
    >
      <TextField<RegisterValues>
        name="phoneNumber"
        label="شماره موبایل"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        dir="ltr"
        size="lg"
        color="primary"
        placeholder="شماره موبایل"
        prefixIcon={<PhoneIcon />}
        className={mixedDirectionInput}
      />

      <TextField<RegisterValues>
        name="password"
        label="رمز عبور"
        type="password"
        autoComplete="new-password"
        dir="ltr"
        size="lg"
        color="primary"
        placeholder="رمز عبور"
        prefixIcon={<LockKeyholeIcon />}
        className={mixedDirectionInput}
      />

      <Button type="submit" size="lg" color="primary" className="tw:w-full">
        ثبت‌نام
      </Button>
    </Form>
  );
}

export { type RegisterValues };
